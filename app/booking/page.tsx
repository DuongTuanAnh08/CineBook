'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { SeatSelection } from '@/components/booking/seat-selection'
import { movies, cinemas } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import type { Seat } from '@/types/booking'

export default function BookingDemoPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  // Demo data
  const movie = movies[0]
  const cinema = cinemas[0]
  const today = new Date().toISOString().split('T')[0]

  const handleConfirm = (selectedSeats: Seat[]) => {
    const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0)
    
    toast({
      title: 'Chuyển đến trang thanh toán',
      description: `Bạn đã chọn ${selectedSeats.length} ghế với tổng giá ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}`,
    })
    
    // In real app, navigate to payment
    // router.push('/payment')
  }

  const handleCancel = () => {
    toast({
      title: 'Đã hủy đặt vé',
      description: 'Bạn có thể chọn suất chiếu khác',
    })
    router.push('/movies')
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Chọn ghế ngồi</h1>
          <p className="text-muted-foreground">
            Chọn ghế yêu thích của bạn (tối đa 8 ghế). Thời gian giữ ghế là 15 phút.
          </p>
        </div>

        {/* Seat Selection Component */}
        <SeatSelection
          movieId={movie.id}
          movieTitle={movie.title}
          moviePoster={movie.poster}
          cinemaName={cinema.name}
          roomName="Phòng 3 - IMAX"
          showDate={today}
          showTime="19:30"
          pricing={{
            standard: 75000,
            vip: 100000,
            couple: 180000,
          }}
          maxSeats={8}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </MainLayout>
  )
}
