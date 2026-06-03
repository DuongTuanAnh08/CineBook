"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import bookingApi from '@/api/bookingApi';
import resaleApi from '@/api/resaleApi';
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Ticket, Calendar, Clock, MapPin, Armchair, Download, Search, QrCode, RefreshCw, Star, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import reviewApi from '@/api/reviewApi';
import { toast } from 'sonner';
import { useNavigate, Navigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useRef } from 'react';

const STATUS = {
  upcoming: {
    label: 'Sắp chiếu',
    className: 'bg-blue-500/20 text-blue-400'
  },
  used: {
    label: 'Đã sử dụng',
    className: 'bg-secondary text-muted-foreground'
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-red-500/20 text-red-500'
  }
};

const mapStatus = (backendStatus) => {
  if (!backendStatus) return 'upcoming';
  if (backendStatus === 'confirmed') return 'upcoming';
  if (backendStatus === 'checkedin') return 'used';
  if (backendStatus === 'cancelled') return 'cancelled';
  return 'upcoming';
};

const TABS = [{
  id: 'all',
  label: 'Tất cả'
}, {
  id: 'upcoming',
  label: 'Sắp chiếu'
}, {
  id: 'used',
  label: 'Đã dùng'
}, {
  id: 'cancelled',
  label: 'Đã hủy'
}];

export default function MyTicketsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useNavigate();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // QR & PDF state
  const [isQrOpen, setIsQrOpen] = useState(false);
  const ticketRef = useRef(null);
  
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      Promise.all([
        bookingApi.getMyBookings(),
        resaleApi.getMyListings(user.userId, { page: 0, size: 100 })
      ])
        .then(([bookingsRes, listingsRes]) => {
          if (bookingsRes.success) {
            setMyTickets(bookingsRes.data);
          }
          if (listingsRes.data?.success) {
            setMyListings(listingsRes.data.data.content);
          }
        })
        .catch(err => console.error('Failed to fetch data:', err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user?.userId]);
  
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }
  
  const filtered = myTickets.filter(t => {
    const status = mapStatus(t.status);
    const matchTab = tab === 'all' || status === tab;
    const matchSearch = String(t.id).toLowerCase().includes(search.toLowerCase()) || (t.movieTitle ?? '').toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const downloadPDF = async (ticket) => {
    setSelectedTicket(ticket);
    setTimeout(async () => {
      if (ticketRef.current) {
        try {
          const dataUrl = await toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2 });
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          // original width is 600px as set in tailwind class w-[600px]
          const pdfHeight = (ticketRef.current.offsetHeight * pdfWidth) / ticketRef.current.offsetWidth;
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Ve_CineBook_${ticket.id}.pdf`);
        } catch (err) {
          console.error("Error generating PDF", err);
          toast.error("Không thể tạo Hóa đơn PDF");
        }
      }
    }, 100);
  };

  const openReviewModal = (ticket) => {
    setSelectedTicket(ticket);
    setReviewForm({ rating: 5, comment: '' });
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedTicket) return;
    setIsSubmittingReview(true);
    try {
      const payload = {
        customerId: null, // Let backend or api client resolve this via token if needed, or we pass user.id. Since user is in context:
        movieId: selectedTicket.movieId || 1, // fallback for mock
        bookingId: selectedTicket.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      };
      
      const res = await reviewApi.createReview(payload);
      if (res.success) {
        toast.success("Đánh giá thành công!");
        setIsReviewOpen(false);
      } else {
        toast.error("Lỗi: " + res.error?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Không thể gửi đánh giá");
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  return (
      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vé của tôi</h1>
            <p className="text-muted-foreground mt-1">Lịch sử đặt vé và vé sắp tới</p>
          </div>
          <Button asChild>
            <Link to="/movies">
              <Ticket className="w-4 h-4 mr-2" />
              Đặt vé mới
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
              {t.label}
              {t.id !== 'all' && <span className="ml-1.5 opacity-70">
                  {myTickets.filter(x => mapStatus(x.status) === t.id).length}
                </span>}
            </button>)}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm theo mã vé hoặc tên phim..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Ticket list */}
        {loading ? <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div> : filtered.length === 0 ? <div className="text-center py-16 text-muted-foreground">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Không có vé nào.</p>
          </div> : <div className="space-y-4">
            {filtered.map(ticket => {
          const statusKey = mapStatus(ticket.status);
          const status = STATUS[statusKey];
          const displayDate = ticket.showDate ? new Date(ticket.showDate).toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'Unknown Date';
          
          return <Card key={ticket.id} className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Poster */}
                      <div className="w-20 shrink-0 bg-muted flex items-center justify-center">
                        <Ticket className="w-8 h-8 text-muted-foreground/30" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-4 space-y-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold leading-tight">{ticket.movieTitle}</h3>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">{ticket.id}</p>
                          </div>
                          <Badge className={status?.className}>{status?.label}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {displayDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ticket.showTime}
                          </div>
                          <div className="flex items-center gap-1 col-span-2 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{ticket.cinemaName} • {ticket.roomName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Armchair className="w-3 h-3" /> Ghế: {ticket.seatNumber}
                          </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            {ticket.totalAmount?.toLocaleString('vi-VN')}₫
                          </span>
                          <div className="flex gap-2 flex-wrap justify-end">
                            {statusKey === 'upcoming' && <>
                                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => { setSelectedTicket(ticket); setIsQrOpen(true); }}>
                                  <QrCode className="w-3 h-3" /> Xem vé
                                </Button>
                                {/* UC-45: Only show resell if not checked-in and showtime not started */}
                                {!ticket.checkedIn && (() => {
                                  const ticketIdNum = parseInt(String(ticket.id).replace('BK', ''), 10);
                                  const isListed = myListings.some(l => parseInt(String(l.bookingId).replace('BK', ''), 10) === ticketIdNum && l.status?.toLowerCase() !== 'deleted' && l.status?.toLowerCase() !== 'cancelled');
                                  
                                  if (isListed) {
                                    return (
                                      <Button size="sm" variant="outline" className="h-7 gap-1 text-xs border-muted text-muted-foreground bg-muted/50 cursor-not-allowed" disabled title="Vé này đã được đăng bán">
                                        <RefreshCw className="w-3 h-3" /> Đã đăng bán
                                      </Button>
                                    );
                                  }
                                  return (
                                    <Button size="sm" variant="outline" className="h-7 gap-1 text-xs border-amber-500/50 text-amber-400 hover:bg-amber-500/10" asChild>
                                      <Link to={`/my-resale/create?bookingId=${ticket.id}`}>
                                        <RefreshCw className="w-3 h-3" /> Đăng bán lại
                                      </Link>
                                    </Button>
                                  );
                                })()}
                              </>}
                            
                            {statusKey === 'used' && (
                              <Button size="sm" variant="outline" className="h-7 gap-1 text-xs border-blue-500/50 text-blue-500 hover:bg-blue-500/10" onClick={() => openReviewModal(ticket)}>
                                <MessageSquare className="w-3 h-3" /> Đánh giá
                              </Button>
                            )}
                            
                            {statusKey !== 'cancelled' && (
                              <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => downloadPDF(ticket)}>
                                <Download className="w-3 h-3" /> PDF
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>;
        })}
          </div>}

        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Đánh giá phim</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="text-center mb-2 font-medium text-lg">
                {selectedTicket?.movieTitle}
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <Label>Chất lượng phim</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          reviewForm.rating >= star
                            ? 'fill-accent text-accent'
                            : 'fill-muted text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 mt-4">
                <Label htmlFor="comment">Cảm nhận của bạn (Tùy chọn)</Label>
                <Textarea 
                  id="comment" 
                  placeholder="Chia sẻ cảm nhận về bộ phim này..." 
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewOpen(false)} disabled={isSubmittingReview}>Hủy</Button>
              <Button onClick={handleSubmitReview} disabled={isSubmittingReview}>
                {isSubmittingReview ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                Gửi đánh giá
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* QR Code Dialog */}
        <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader>
              <DialogTitle className="text-center">Vé điện tử</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="p-4 bg-white rounded-xl">
                  <QRCodeSVG value={selectedTicket.id} size={200} level="M" />
                </div>
                <div className="text-center space-y-1 w-full">
                  <h3 className="font-bold text-xl">{selectedTicket.movieTitle}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{selectedTicket.id}</p>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 text-sm gap-2 text-left bg-muted/30 p-3 rounded-lg">
                    <div>
                      <span className="text-muted-foreground text-xs block">Rạp</span>
                      <span className="font-medium">{selectedTicket.cinemaName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Phòng</span>
                      <span className="font-medium">{selectedTicket.roomName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Thời gian</span>
                      <span className="font-medium">{selectedTicket.showTime}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Ghế</span>
                      <span className="font-medium text-primary">{selectedTicket.seatNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Hidden Invoice for PDF Generation */}
        {selectedTicket && (
          <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <div ref={ticketRef} className="w-[600px] bg-white text-black p-8" style={{ fontFamily: 'sans-serif' }}>
              <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">CINEBOOK</h1>
                  <p className="text-sm mt-1 text-gray-500">Hóa đơn điện tử</p>
                </div>
                <div className="text-right">
                  <QRCodeSVG value={selectedTicket.id} size={64} />
                  <p className="text-xs font-mono mt-2">{selectedTicket.id}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedTicket.movieTitle}</h2>
                  <p className="text-gray-600">{selectedTicket.cinemaName} • {selectedTicket.roomName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-gray-500 text-sm block">Suất chiếu</span>
                    <span className="font-semibold text-lg">{selectedTicket.showTime}</span>
                    <span className="text-gray-600 ml-2">{selectedTicket.showDate ? new Date(selectedTicket.showDate).toLocaleDateString('vi-VN') : ''}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm block">Ghế</span>
                    <span className="font-semibold text-lg">{selectedTicket.seatNumber}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tổng tiền vé</span>
                    <span className="font-medium">{selectedTicket.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">VAT (10%)</span>
                    <span className="font-medium">Đã bao gồm</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                    <span className="font-bold text-xl">Thành tiền</span>
                    <span className="font-bold text-2xl">{selectedTicket.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center text-sm text-gray-400 border-t border-gray-100 pt-4">
                <p>Cảm ơn bạn đã lựa chọn CineBook!</p>
                <p className="mt-1">Vui lòng xuất trình mã QR tại rạp để nhận vé cứng.</p>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
