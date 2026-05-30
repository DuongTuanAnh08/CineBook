"use client";

import { AdminLayout } from '@/components/layout';
import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LayoutGrid, Plus, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

const ROOM_TYPE_COLOR = {
  IMAX: 'bg-purple-500/20 text-purple-400',
  '3D': 'bg-blue-500/20 text-blue-400',
  '2D': 'bg-secondary text-muted-foreground'
};

export default function AdminRoomsPage() {
  const { cinemas } = useData();
  const mockRooms = cinemas.flatMap((cinema, ci) => Array.from({
    length: [8, 6, 10, 7, 9][ci] ?? 6
  }, (_, i) => ({
    id: `${cinema.id}-${i + 1}`,
    cinemaId: cinema.id,
    cinemaName: cinema.name,
    name: `Phòng ${i + 1}`,
    type: i % 3 === 0 ? 'IMAX' : i % 3 === 1 ? '3D' : '2D',
    capacity: i % 3 === 0 ? 300 : i % 3 === 1 ? 120 : 150,
    status: 'active'
  })));

  const [selectedCinema, setSelectedCinema] = useState('all');
  const filtered = mockRooms.filter(r => selectedCinema === 'all' || r.cinemaId === selectedCinema);
  const activeCount = filtered.filter(r => r.status === 'active').length;
  const maintenanceCount = filtered.filter(r => r.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Phòng chiếu</h1>
          <p className="text-muted-foreground mt-1">Cấu hình và giám sát các phòng chiếu</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm phòng chiếu
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[{
          label: 'Tổng phòng chiếu',
          value: filtered.length
        }, {
          label: 'Đang hoạt động',
          value: activeCount
        }, {
          label: 'Bảo trì',
          value: maintenanceCount
        }, {
          label: 'Tổng ghế',
          value: filtered.reduce((a, r) => a + r.capacity, 0).toLocaleString()
        }].map(s => (
          <Card key={s.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
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
            <Select value={selectedCinema} onValueChange={setSelectedCinema}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Lọc theo rạp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả rạp</SelectItem>
                {cinemas.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground ml-auto">{filtered.length} phòng</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Tên phòng</TableHead>
                <TableHead>Rạp</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số ghế</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(room => (
                <TableRow key={room.id} className="border-border">
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {room.cinemaName}
                  </TableCell>
                  <TableCell>
                    <Badge className={ROOM_TYPE_COLOR[room.type]}>{room.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{room.capacity} ghế</TableCell>
                  <TableCell>
                    <Badge className={room.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}>
                      {room.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
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
                          <Eye className="w-4 h-4" /> Xem sơ đồ ghế
                        </DropdownMenuItem>
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
  );
}
