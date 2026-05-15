'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { SeatSelection } from '@/components/booking/seat-selection'
import { movies, cinemas } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import type { Seat } from '@/types/booking'

interface BookingPageProps {
  params: Promise<{
    movieId: string
  }>
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Get query params
  const cinemaId = searchParams.get('cinema') || '1'
  const room = searchParams.get('room') || 'Phòng 1'
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const time = searchParams.get('time') || '19:30'
  
  // Find movie and cinema
  const movie = movies.find((m) => m.id === searchParams.get('id')) || movies[0]
  const cinema = cinemas.find((c) => c.id === cinemaId) || cinemas[0]

  const handleConfirm = (selectedSeats: Seat[]) => {
    toast({
      title: 'Đã chọn ghế!',
      description: `${selectedSeats.length} ghế: ${selectedSeats.map((s) => s.id).join(', ')}`,
    })
    const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0)
    const params = new URLSearchParams({
      seats: selectedSeats.map((s) => s.id).join(','),
      movie: movie.id,
      cinema: cinemaId,
      room,
      date,
      time,
      total: totalPrice.toString(),
    })
    router.push(`/payment?${params.toString()}`)
  }

  const handleCancel = () => {
    router.back()
  }

  if (!movie) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <AlertTriangle className="size-16 mx-auto text-amber-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Không tìm thấy phim</h1>
            <p className="text-muted-foreground mb-6">
              Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild>
              <Link href="/movies">Quay lại danh sách phim</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chọn ghế</h1>
            <p className="text-muted-foreground">
              {movie.title} - {time}, {new Date(date).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Seat Selection */}
        <SeatSelection
          movieId={movie.id}
          movieTitle={movie.title}
          moviePoster={movie.poster}
          cinemaName={cinema.name}
          roomName={room}
          showDate={date}
          showTime={time}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </MainLayout>
  )
}
