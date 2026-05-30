"use client";

import { AdminLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Search, MoreHorizontal, Eye, Ban, Download } from 'lucide-react';
import { useState } from 'react';
const mockCustomers = [{
  id: 'U001',
  name: 'Nguyễn Văn An',
  email: 'an.nguyen@email.com',
  phone: '0901234567',
  totalBookings: 15,
  totalSpent: 2250000,
  joinDate: '2023-05-10',
  status: 'active'
}, {
  id: 'U002',
  name: 'Trần Thị Bình',
  email: 'binh.tran@email.com',
  phone: '0912345678',
  totalBookings: 8,
  totalSpent: 960000,
  joinDate: '2023-08-22',
  status: 'active'
}, {
  id: 'U003',
  name: 'Lê Văn Cường',
  email: 'cuong.le@email.com',
  phone: '0923456789',
  totalBookings: 23,
  totalSpent: 4140000,
  joinDate: '2022-11-03',
  status: 'active'
}, {
  id: 'U004',
  name: 'Phạm Thị Dung',
  email: 'dung.pham@email.com',
  phone: '0934567890',
  totalBookings: 3,
  totalSpent: 270000,
  joinDate: '2024-01-15',
  status: 'blocked'
}, {
  id: 'U005',
  name: 'Hoàng Văn Em',
  email: 'em.hoang@email.com',
  phone: '0945678901',
  totalBookings: 31,
  totalSpent: 5580000,
  joinDate: '2022-07-19',
  status: 'active'
}, {
  id: 'U006',
  name: 'Võ Thị Phương',
  email: 'phuong.vo@email.com',
  phone: '0956789012',
  totalBookings: 12,
  totalSpent: 1800000,
  joinDate: '2023-03-01',
  status: 'active'
}, {
  id: 'U007',
  name: 'Đặng Quốc Hùng',
  email: 'hung.dang@email.com',
  phone: '0967890123',
  totalBookings: 7,
  totalSpent: 945000,
  joinDate: '2023-10-30',
  status: 'active'
}, {
  id: 'U008',
  name: 'Bùi Thị Lan',
  email: 'lan.bui@email.com',
  phone: '0978901234',
  totalBookings: 19,
  totalSpent: 3420000,
  joinDate: '2022-12-12',
  status: 'active'
}];
function getInitials(name) {
  return name.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase();
}
function getTier(spent) {
  if (spent >= 4000000) return {
    label: 'VIP',
    className: 'bg-yellow-500/20 text-yellow-500'
  };
  if (spent >= 2000000) return {
    label: 'Gold',
    className: 'bg-orange-500/20 text-orange-400'
  };
  return {
    label: 'Member',
    className: 'bg-secondary text-muted-foreground'
  };
}
export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const filtered = mockCustomers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Khách hàng</h1>
            <p className="text-muted-foreground mt-1">Quản lý và theo dõi tài khoản khách hàng</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất danh sách
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[{
          label: 'Tổng khách hàng',
          value: mockCustomers.length
        }, {
          label: 'Đang hoạt động',
          value: mockCustomers.filter(c => c.status === 'active').length
        }, {
          label: 'Khách VIP',
          value: mockCustomers.filter(c => c.totalSpent >= 4000000).length
        }, {
          label: 'Tổng chi tiêu',
          value: `${(mockCustomers.reduce((a, c) => a + c.totalSpent, 0) / 1000000).toFixed(1)}M ₫`
        }].map(s => <Card key={s.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>)}
        </div>

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Tìm tên, email, số điện thoại..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <span className="text-sm text-muted-foreground ml-auto">{filtered.length} khách hàng</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Tổng đơn</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead>Hạng</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(customer => {
                const tier = getTier(customer.totalSpent);
                return <TableRow key={customer.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-primary/20 text-primary">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{customer.email}</p>
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{customer.totalBookings} đơn</TableCell>
                      <TableCell className="text-sm font-medium">
                        {customer.totalSpent.toLocaleString('vi-VN')}₫
                      </TableCell>
                      <TableCell>
                        <Badge className={tier.className}>{tier.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{customer.joinDate}</TableCell>
                      <TableCell>
                        <Badge className={customer.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                          {customer.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
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
                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                              <Ban className="w-4 h-4" />
                              {customer.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>;
              })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
}
