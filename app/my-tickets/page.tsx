"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'
import { movies } from '@/lib/mock-data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Ticket, Calendar, Clock, MapPin, Armchair, Download, Search, QrCode } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type TicketStatus = 'upcoming' | 'used' | 'cancelled'

const mockTickets = [
  {
    id: 'BK001',
    movieId: '2',
    cinema: 'CineBook Vincom Mega Mall',
    room: 'Phòng 3 (IMAX)',
    date: '2024-06-20',
    time: '19:30',
    seats: ['E5', 'E6'],
    total: 200000,
    status: 'upcoming' as TicketStatus,
    method: 'Ví MoMo',
  },
  {
    id: 'BK002',
    movieId: '1',
    cinema: 'CineBook Landmark 81',
    room: 'Phòng 1',
    date: '2024-05-15',
    time: '20:45',
    seats: ['C8', 'C9'],
    total: 180000,
    status: 'used' as TicketStatus,
    method: 'Thẻ tín dụng',
  },
  {
    id: 'BK003',
    movieId: '3',
    cinema: 'CineBook Royal City',
    room: 'Phòng 2',
    date: '2024-05-01',
    time: '14:00',
    seats: ['A3'],
    total: 75000,
    status: 'used' as TicketStatus,
    method: 'ZaloPay',
  },
  {
    id: 'BK004',
    movieId: '4',
    cinema: 'CineBook Aeon Mall',
    room: 'Phòng 5',
    date: '2024-04-20',
    time: '16:15',
    seats: ['D5', 'D6', 'D7'],
    total: 270000,
    status: 'cancelled' as TicketStatus,
    method: 'Chuyển khoản',
  },
]

const STATUS: Record<TicketStatus, { label: string; className: string }> = {
  upcoming: { label: 'Sắp chiếu', className: 'bg-blue-500/20 text-blue-400' },
  used: { label: 'Đã sử dụng', className: 'bg-secondary text-muted-foreground' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-500/20 text-red-500' },
}

const TABS: { id: TicketStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'upcoming', label: 'Sắp chiếu' },
  { id: 'used', label: 'Đã dùng' },
  { id: 'cancelled', label: 'Đã hủy' },
]

export default function MyTicketsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<TicketStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  if (!isAuthenticated) {
    router.replace('/login')
    return null
  }

  const filtered = mockTickets.filter((t) => {
    const movie = movies.find((m) => m.id === t.movieId)
    const matchTab = tab === 'all' || t.status === tab
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (movie?.title ?? '').toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vé của tôi</h1>
            <p className="text-muted-foreground mt-1">Lịch sử đặt vé và vé sắp tới</p>
          </div>
          <Button asChild>
            <Link href="/movies">
              <Ticket className="w-4 h-4 mr-2" />
              Đặt vé mới
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
              {t.id !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  {mockTickets.filter((x) => x.status === t.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã vé hoặc tên phim..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Ticket list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Không có vé nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ticket) => {
              const movie = movies.find((m) => m.id === ticket.movieId)
              const status = STATUS[ticket.status]
              const displayDate = new Date(ticket.date).toLocaleDateString('vi-VN', {
                weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
              })
              return (
                <Card key={ticket.id} className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Poster */}
                      <div className="w-20 shrink-0">
                        <img
                          src={movie?.poster}
                          alt={movie?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-4 space-y-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold leading-tight">{movie?.title}</h3>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">{ticket.id}</p>
                          </div>
                          <Badge className={status.className}>{status.label}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {displayDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ticket.time}
                          </div>
                          <div className="flex items-center gap-1 col-span-2 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{ticket.cinema} • {ticket.room}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Armchair className="w-3 h-3" /> Ghế: {ticket.seats.join(', ')}
                          </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            {ticket.total.toLocaleString('vi-VN')}₫
                          </span>
                          <div className="flex gap-2">
                            {ticket.status === 'upcoming' && (
                              <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                                <QrCode className="w-3 h-3" /> Xem vé
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                              <Download className="w-3 h-3" /> PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
