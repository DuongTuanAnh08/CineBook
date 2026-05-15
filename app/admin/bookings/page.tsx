"use client"

import { AdminLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Ticket, Search, MoreHorizontal, Eye, Ban, Download } from 'lucide-react'
import { useState } from 'react'

type BookingStatus = 'completed' | 'pending' | 'cancelled'

const mockBookings = [
  { id: 'BK001', movie: 'Điệp Viên 007', customer: 'Nguyễn Văn An', phone: '0901234567', cinema: 'Vincom Mega Mall', room: 'Phòng 1', showtime: '18:30', seats: 'A4, A5', amount: 280000, status: 'completed' as BookingStatus, date: '2024-05-15' },
  { id: 'BK002', movie: 'Dune: Phần 2', customer: 'Trần Thị Bình', phone: '0912345678', cinema: 'Landmark 81', room: 'Phòng 3', showtime: '20:45', seats: 'E6, E7, E8', amount: 450000, status: 'pending' as BookingStatus, date: '2024-05-15' },
  { id: 'BK003', movie: 'Kungfu Panda 4', customer: 'Lê Văn Cường', phone: '0923456789', cinema: 'Royal City', room: 'Phòng 2', showtime: '14:00', seats: 'C5, C6', amount: 180000, status: 'completed' as BookingStatus, date: '2024-05-14' },
  { id: 'BK004', movie: 'Godzilla x Kong', customer: 'Phạm Thị Dung', phone: '0934567890', cinema: 'Aeon Mall', room: 'Phòng 5', showtime: '16:15', seats: 'D8', amount: 90000, status: 'cancelled' as BookingStatus, date: '2024-05-14' },
  { id: 'BK005', movie: 'Deadpool & Wolverine', customer: 'Hoàng Văn Em', phone: '0945678901', cinema: 'Times City', room: 'Phòng 4', showtime: '21:00', seats: 'G5, G6', amount: 200000, status: 'completed' as BookingStatus, date: '2024-05-13' },
  { id: 'BK006', movie: 'Inside Out 2', customer: 'Võ Thị Phương', phone: '0956789012', cinema: 'Vincom Mega Mall', room: 'Phòng 2', showtime: '10:00', seats: 'B3, B4, B5, B6', amount: 360000, status: 'completed' as BookingStatus, date: '2024-05-13' },
  { id: 'BK007', movie: 'Venom 3', customer: 'Đặng Quốc Hùng', phone: '0967890123', cinema: 'Landmark 81', room: 'Phòng 1', showtime: '23:00', seats: 'J1, J2', amount: 360000, status: 'pending' as BookingStatus, date: '2024-05-12' },
  { id: 'BK008', movie: 'Nhà Bà Nữ', customer: 'Bùi Thị Lan', phone: '0978901234', cinema: 'Royal City', room: 'Phòng 6', showtime: '09:30', seats: 'A1, A2, A3', amount: 270000, status: 'cancelled' as BookingStatus, date: '2024-05-12' },
]

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  completed: { label: 'Hoàn thành', className: 'bg-green-500/20 text-green-500' },
  pending: { label: 'Chờ xử lý', className: 'bg-yellow-500/20 text-yellow-500' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-500/20 text-red-500' },
}

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = mockBookings.filter((b) => {
    const matchSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.movie.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = mockBookings
    .filter((b) => b.status === 'completed')
    .reduce((a, b) => a + b.amount, 0)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Đặt vé</h1>
            <p className="text-muted-foreground mt-1">Theo dõi và quản lý tất cả đơn đặt vé</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Tổng đơn', value: mockBookings.length },
            { label: 'Hoàn thành', value: mockBookings.filter((b) => b.status === 'completed').length },
            { label: 'Chờ xử lý', value: mockBookings.filter((b) => b.status === 'pending').length },
            {
              label: 'Doanh thu',
              value: `${(totalRevenue / 1000000).toFixed(1)}M ₫`,
            },
          ].map((s) => (
            <Card key={s.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <Ticket className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm mã vé, khách hàng, phim..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-auto">{filtered.length} đơn</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Mã vé</TableHead>
                  <TableHead>Phim</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Rạp / Giờ chiếu</TableHead>
                  <TableHead>Ghế</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((booking) => (
                  <TableRow key={booking.id} className="border-border">
                    <TableCell className="font-mono text-sm font-medium">{booking.id}</TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate">{booking.movie}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{booking.customer}</p>
                        <p className="text-xs text-muted-foreground">{booking.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{booking.cinema}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.room} • {booking.showtime}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{booking.seats}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {booking.amount.toLocaleString('vi-VN')}₫
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{booking.date}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_CONFIG[booking.status].className}>
                        {STATUS_CONFIG[booking.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" /> Xem chi tiết
                          </DropdownMenuItem>
                          {booking.status === 'pending' && (
                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                              <Ban className="w-4 h-4" /> Hủy đơn
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
