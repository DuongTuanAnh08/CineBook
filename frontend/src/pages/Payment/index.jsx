"use client";

import { useState, Suspense, useEffect } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';

import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Building2, Smartphone, Loader2, Lock, Tag, ShoppingCart, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import bookingApi from '@/api/bookingApi';
import promoApi from '@/api/promoApi';
import paymentApi from '@/api/paymentApi';
import { toast } from 'sonner';

// VNPay logo inline SVG
const VNPayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#0066CC"/>
    <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">VN</text>
  </svg>
);

const PAYMENT_METHODS = [{
  id: 'vnpay',
  label: 'VNPay',
  icon: VNPayIcon,
  desc: 'Thẻ ATM, Visa, MasterCard, QR Code'
}];

function PaymentContent() {
  const router = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { movies, cinemas } = useData();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }
  const subtotal = Number(params.get('total') ?? 0); // This is now PRE-TAX subtotal
  const seatTotal = Number(params.get('seatTotal') ?? 0);
  const vatPercent = Number(params.get('vatPercent') ?? 10);
  const seats = params.get('seats')?.split(',') || [];
  const showtimeId = params.get('showtimeId') ?? '1';
  const movieId = params.get('movie') ?? '1';
  const cinemaId = params.get('cinema') ?? '1';
  const cinema = cinemas.find(c => c.id === cinemaId)?.name ?? 'Rạp CineBook';
  const room = params.get('room') ?? 'Phòng 1';
  const date = params.get('date') ?? '';
  const time = params.get('time') ?? '';
  
  // Parse concessions
  const concessionsParam = params.get('concessions');
  const concessions = concessionsParam ? (() => {
    try {
      return JSON.parse(concessionsParam);
    } catch {
      return [];
    }
  })() : [];
  const concessionTotal = concessions.reduce((acc, c) => acc + c.price * c.qty, 0);
  const movie = movies.find(m => m.id === movieId) ?? movies[0];
  const [method, setMethod] = useState('vnpay');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  
  const [calcResults, setCalcResults] = useState(null);
  const [isLoadingCalc, setIsLoadingCalc] = useState(false);

  const fetchCalculation = async (appliedCode) => {
    setIsLoadingCalc(true);
    setPromoError('');
    try {
      const payload = {
        customerId: user?.userId || user?.id,
        showtimeId: Number(showtimeId),
        seatIds: seats.map(s => Number(s)),
        fnbItems: concessions.map(c => ({
          productId: Number(c.id),
          quantity: Number(c.qty)
        })),
        promoCode: appliedCode || null
      };
      const res = await bookingApi.calculateBooking(payload);
      if (res.success && res.data) {
        setCalcResults(res.data);
        if (appliedCode) {
          setPromoApplied(true);
          setPromoData({
            discountType: res.data.promoDiscountType,
            discountValue: res.data.promoDiscountValue
          });
          toast.success(`Đã áp dụng mã ${appliedCode}.`);
        } else {
          setPromoApplied(false);
          setPromoData(null);
        }
      }
    } catch (err) {
      setPromoError(err.response?.data?.error?.message || err.message || 'Mã không hợp lệ hoặc không đủ điều kiện.');
      setPromoApplied(false);
      setPromoData(null);
      if (appliedCode) {
        // Recalculate without promo code
        fetchCalculation(null);
      }
    } finally {
      setIsLoadingCalc(false);
    }
  };

  useEffect(() => {
    if (user && showtimeId && seats.length > 0) {
      fetchCalculation(null);
    }
  }, [user, showtimeId, params.get('seats'), concessionsParam]);

  const discount = calcResults ? calcResults.discountAmount : 0;
  const calculatedVatAmount = calcResults ? calcResults.vatAmount : Math.round(subtotal * (vatPercent / 100));
  const finalTotal = calcResults ? calcResults.totalAmount : (subtotal + calculatedVatAmount);
  
  const displaySeatTotal = calcResults ? calcResults.ticketTotal : (subtotal - concessionTotal);
  const displayConcessionTotal = calcResults ? calcResults.fnbTotal : concessionTotal;
  const displayVatPercent = calcResults ? Math.round(calcResults.vatRate * 100) : vatPercent;

  const handleApplyPromo = () => {
    if (!promoCode) return;
    fetchCalculation(promoCode);
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Step 1: Tạo booking trước
      const payload = {
        customerId: user?.userId || user?.id,
        showtimeId: Number(showtimeId),
        seatIds: seats.map(s => Number(s)),
        fnbItems: concessions.map(c => ({
          productId: Number(c.id),
          quantity: Number(c.qty)
        }))
      };
      
      if (promoApplied && promoCode) {
        payload.promoCode = promoCode;
      }
      
      const res = await bookingApi.createBooking(payload);
      
      if (!res.success) {
        toast.error(res.error?.message || 'Không thể tạo đặt vé');
        return;
      }

      const bookingId = res.data.id || res.data.bookingId;
      sessionStorage.setItem('pendingBookingId', bookingId);

      // Step 2: Nếu chọn VNPay, lấy URL và redirect
      if (method === 'vnpay') {
        const payRes = await paymentApi.createVNPayUrl(bookingId);
        if (payRes.success && payRes.data) {
          // Redirect sang cổng VNPay Sandbox
          window.location.href = payRes.data;
          return;
        } else {
          toast.error(payRes.error?.message || 'Lỗi kết nối cổng thanh toán');
          return;
        }
      }

      // Step 3: Các phương thức khác (demo - chuyển thẳng tới success)
      const successParams = new URLSearchParams({
        bookingId,
        movie: movieId,
        seats: seats.join(','),
        room,
        date,
        time,
        total: finalTotal.toString(),
        method
      });
      if (concessions.length > 0) {
        successParams.set('concessions', JSON.stringify(concessions));
      }
      router(`/booking/success?${successParams.toString()}`);

    } catch (err) {
      toast.error(err.error?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setProcessing(false);
    }
  };

  const displayDate = date ? new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : '';

  return <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Thanh toán</h1>
          <p className="text-muted-foreground text-sm">Hoàn tất đặt vé xem phim</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Payment form */}
        <div className="lg:col-span-3 space-y-5">
          {/* Payment method */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PAYMENT_METHODS.map(m => {
              const Icon = m.icon;
              const isVNPay = m.id === 'vnpay';
              return <button key={m.id} className={cn('w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left relative', method === m.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50')} onClick={() => setMethod(m.id)}>
                    <div className={cn('w-4 h-4 rounded-full border-2 shrink-0', method === m.id ? 'border-primary bg-primary' : 'border-muted-foreground')} />
                    <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        {m.label}
                        {isVNPay && <span className="text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded font-semibold">Khuyến nghị</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>;
              })}
            </CardContent>
          </Card>

          {/* VNPay info */}
          {method === 'vnpay' && <Card className="bg-card border-border border-blue-500/30">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-blue-400">Thanh toán qua VNPay Sandbox</p>
                    <p className="text-muted-foreground text-xs">Bạn sẽ được chuyển đến cổng thanh toán VNPay an toàn. Hỗ trợ thẻ ATM nội địa, Visa/Mastercard, và QR Code.</p>
                    <p className="text-xs text-amber-400 mt-1">⚠️ Đây là môi trường Sandbox (thử nghiệm). Thẻ test: 9704198526191432198 / NGUYEN VAN A / 07/15 / OTP: 123456</p>
                  </div>
                </div>
              </CardContent>
            </Card>}


        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Thông tin đặt vé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Movie info */}
              <div className="flex gap-3">
                <img src={movie?.poster} alt={movie?.title} className="w-14 rounded-lg object-cover aspect-[2/3]" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">{movie?.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{movie?.ageRating} • {movie?.duration} phút</p>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Booking details */}
              <div className="space-y-2 text-sm">
                {[{
                label: 'Ngày chiếu',
                value: displayDate
              }, {
                label: 'Suất chiếu',
                value: time
              }, {
                label: 'Phòng',
                value: room
              }, {
                label: 'Ghế',
                value: seats.join(', ')
              }].map(item => <div key={item.label} className="flex justify-between gap-2">
                    <span className="text-muted-foreground shrink-0">{item.label}</span>
                    <span className="font-medium text-right">{item.value}</span>
                  </div>)}
              </div>

              <Separator className="bg-border" />

              {/* Concession summary */}
              {concessions.length > 0 && <>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Đồ ăn & Thức uống
                    </p>
                    {concessions.map(c => <div key={c.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{c.name} ×{c.qty}</span>
                        <span className="font-medium">{(c.price * c.qty).toLocaleString('vi-VN')}₫</span>
                      </div>)}
                  </div>
                  <Separator className="bg-border" />
                </>}

              {/* Promo code */}
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Mã khuyến mãi
                </Label>
                {promoApplied ? <div className="flex items-center justify-between rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2">
                    <span className="text-sm text-green-500 font-mono font-bold">{promoCode}</span>
                    <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => {
                  setPromoApplied(false);
                  setPromoCode('');
                  setPromoData(null);
                  fetchCalculation(null);
                }}>
                      Xóa
                    </button>
                  </div> : <div className="flex gap-2">
                    <Input placeholder="Nhập mã khuyến mãi" value={promoCode} onChange={e => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoError('');
                }} className="h-9 text-sm" />
                    <Button variant="outline" size="sm" onClick={handleApplyPromo} className="shrink-0">
                      Áp dụng
                    </Button>
                  </div>}
                {promoError && <p className="text-xs text-destructive">{promoError}</p>}
              </div>

              <Separator className="bg-border" />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm relative">
                {isLoadingCalc && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiền vé ({seats.length} ghế)</span>
                  <span>{displaySeatTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                {displayConcessionTotal > 0 && <div className="flex justify-between">
                    <span className="text-muted-foreground">Đồ ăn & nước</span>
                    <span>{displayConcessionTotal.toLocaleString('vi-VN')}₫</span>
                  </div>}
                {promoApplied && <div className="flex justify-between text-green-500">
                    <span>Giảm giá ({promoData?.discountType === 'Percentage' ? `${promoData.discountValue}%` : 'Trực tiếp'})</span>
                    <span>-{discount.toLocaleString('vi-VN')}₫</span>
                  </div>}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thuế VAT ({displayVatPercent}%)</span>
                  <span>{calculatedVatAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{finalTotal.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <Button className="w-full gap-2" onClick={handlePayment} disabled={processing} size="lg">
                {processing ? <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </> : <>
                    <Lock className="w-4 h-4" />
                    {method === 'vnpay' ? 'Thanh toán qua VNPay' : `Thanh toán ${finalTotal.toLocaleString('vi-VN')}₫`}
                  </>}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                🔒 Giao dịch được mã hóa và bảo mật bởi VNPay
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}

export default function PaymentPage() {
  return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
        <PaymentContent />
      </Suspense>
    );
}
