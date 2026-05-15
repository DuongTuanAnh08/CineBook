"use client"

import { AdminLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Tag, Plus, Search, MoreHorizontal, Pencil, Trash2, Copy } from 'lucide-react'
import { useState } from 'react'

type PromoStatus = 'active' | 'expired' | 'upcoming'

const mockPromos = [
  { id: '1', code: 'SUMMER24', name: 'Ưu đãi mùa hè', discount: 20, type: 'percent', minAmount: 200000, usedCount: 342, maxUses: 500, startDate: '2024-06-01', endDate: '2024-08-31', status: 'active' as PromoStatus },
  { id: '2', code: 'FIRST50K', name: 'Giảm 50K lần đầu', discount: 50000, type: 'fixed', minAmount: 150000, usedCount: 89, maxUses: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' as PromoStatus },
  { id: '3', code: 'WEEKEND15', name: 'Cuối tuần -15%', discount: 15, type: 'percent', minAmount: 0, usedCount: 521, maxUses: 300, startDate: '2024-04-01', endDate: '2024-05-01', status: 'expired' as PromoStatus },
  { id: '4', code: 'XMAS30', name: 'Giáng sinh vui vẻ', discount: 30, type: 'percent', minAmount: 300000, usedCount: 0, maxUses: 200, startDate: '2024-12-20', endDate: '2024-12-26', status: 'upcoming' as PromoStatus },
  { id: '5', code: 'STUDENT20', name: 'Sinh viên -20%', discount: 20, type: 'percent', minAmount: 100000, usedCount: 156, maxUses: 999, startDate: '2024-03-01', endDate: '2024-12-31', status: 'active' as PromoStatus },
]

const STATUS_CONFIG: Record<PromoStatus, { label: string; className: string }> = {
  active: { label: 'Đang hoạt động', className: 'bg-green-500/20 text-green-500' },
  expired: { label: 'Đã hết hạn', className: 'bg-red-500/20 text-red-500' },
  upcoming: { label: 'Sắp diễn ra', className: 'bg-blue-500/20 text-blue-500' },
}

export default function AdminPromotionsPage() {
  const [search, setSearch] = useState('')

  const filtered = mockPromos.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Khuyến mãi</h1>
            <p className="text-muted-foreground mt-1">Quản lý mã giảm giá và chương trình ưu đãi</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo khuyến mãi
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Tổng mã', value: mockPromos.length },
            { label: 'Đang hoạt động', value: mockPromos.filter((p) => p.status === 'active').length },
            { label: 'Tổng lượt dùng', value: mockPromos.reduce((a, p) => a + p.usedCount, 0) },
            { label: 'Sắp diễn ra', value: mockPromos.filter((p) => p.status === 'upcoming').length },
          ].map((s) => (
            <Card key={s.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <Tag className="w-4 h-4 text-muted-foreground" />
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
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm mã hoặc tên khuyến mãi..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <span className="text-sm text-muted-foreground ml-auto">{filtered.length} khuyến mãi</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên chương trình</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Đơn tối thiểu</TableHead>
                  <TableHead>Lượt dùng</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((promo) => (
                  <TableRow key={promo.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-bold bg-secondary px-2 py-0.5 rounded">
                          {promo.code}
                        </code>
                        <button
                          className="text-muted-foreground hover:text-foreground"
                          title="Sao chép mã"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>
                      <span className="text-primary font-semibold">
                        {promo.type === 'percent'
                          ? `-${promo.discount}%`
                          : `-${promo.discount.toLocaleString('vi-VN')}₫`}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {promo.minAmount > 0
                        ? `${promo.minAmount.toLocaleString('vi-VN')}₫`
                        : 'Không giới hạn'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{promo.usedCount}</span>
                        <span className="text-muted-foreground">/{promo.maxUses}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min((promo.usedCount / promo.maxUses) * 100, 100)}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {promo.startDate} → {promo.endDate}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_CONFIG[promo.status].className}>
                        {STATUS_CONFIG[promo.status].label}
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
                            <Pencil className="w-4 h-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4" /> Xóa
                          </DropdownMenuItem>
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
