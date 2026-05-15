"use client"

import { AdminLayout } from '@/components/layout'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Ticket,
  Film,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

// Mock statistics
const stats = [
  {
    title: 'Tổng doanh thu',
    value: '₫2.4B',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
    description: 'So với tháng trước',
  },
  {
    title: 'Vé đã bán',
    value: '12,456',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: Ticket,
    description: 'Trong 30 ngày qua',
  },
  {
    title: 'Phim đang chiếu',
    value: '24',
    change: '+3',
    changeType: 'positive' as const,
    icon: Film,
    description: 'Phim mới trong tuần',
  },
  {
    title: 'Khách hàng',
    value: '8,234',
    change: '-2.1%',
    changeType: 'negative' as const,
    icon: Users,
    description: 'Khách hàng hoạt động',
  },
]

// Mock recent bookings
const recentBookings = [
  { id: 'BK001', movie: 'Avengers: Secret Wars', customer: 'Nguyễn Văn A', seats: 'A1, A2', amount: '₫280,000', status: 'completed' },
  { id: 'BK002', movie: 'Dune: Part Three', customer: 'Trần Thị B', seats: 'D5', amount: '₫150,000', status: 'pending' },
  { id: 'BK003', movie: 'The Batman 2', customer: 'Lê Văn C', seats: 'B3, B4, B5', amount: '₫420,000', status: 'completed' },
  { id: 'BK004', movie: 'Spider-Man 4', customer: 'Phạm Thị D', seats: 'C8, C9', amount: '₫300,000', status: 'cancelled' },
]

export default function AdminDashboard() {
  const { user, setMockUser, isAuthenticated } = useAuth()

  // Auto-set admin role for demo purposes if not authenticated
  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
      setMockUser('admin')
    }
  }, [isAuthenticated, user?.role, setMockUser])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Chào mừng trở lại, {user?.name || 'Admin'}! Đây là tổng quan hoạt động của rạp.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`flex items-center text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Bookings */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Đặt vé gần đây</CardTitle>
                <CardDescription>Có 12 đơn đặt vé mới hôm nay</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/bookings">Xem tất cả</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{booking.movie}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{booking.customer}</span>
                        <span>•</span>
                        <span>Ghế: {booking.seats}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{booking.amount}</p>
                      <Badge
                        variant={
                          booking.status === 'completed'
                            ? 'default'
                            : booking.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className={
                          booking.status === 'completed'
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                            : booking.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                            : ''
                        }
                      >
                        {booking.status === 'completed'
                          ? 'Hoàn thành'
                          : booking.status === 'pending'
                          ? 'Chờ xử lý'
                          : 'Đã hủy'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
              <CardDescription>Truy cập nhanh các chức năng quản lý</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 hover:border-primary hover:text-primary"
                  asChild
                >
                  <Link href="/admin/movies">
                    <Film className="w-6 h-6" />
                    <span>Quản lý Phim</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 hover:border-primary hover:text-primary"
                  asChild
                >
                  <Link href="/admin/showtimes">
                    <Calendar className="w-6 h-6" />
                    <span>Lịch chiếu</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 hover:border-primary hover:text-primary"
                  asChild
                >
                  <Link href="/admin/cinemas">
                    <MapPin className="w-6 h-6" />
                    <span>Quản lý Rạp</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 hover:border-primary hover:text-primary"
                  asChild
                >
                  <Link href="/admin/analytics">
                    <TrendingUp className="w-6 h-6" />
                    <span>Báo cáo</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
