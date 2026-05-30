"use client";

import { AdminLayout } from '@/components/layout';
import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MapPin, Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
const roomsPerCinema = {
  '1': 8,
  '2': 6,
  '3': 10,
  '4': 7,
  '5': 9
};

export default function AdminCinemasPage() {
  const { cinemas } = useData();
  const cities = [...new Set(cinemas.map(c => c.city))];
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const filtered = cinemas.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase());
    const matchCity = selectedCity === 'all' || c.city === selectedCity;
    return matchSearch && matchCity;
  });
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Rạp chiếu</h1>
            <p className="text-muted-foreground mt-1">Danh sách chi nhánh rạp trên toàn quốc</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm rạp mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {[{
          label: 'Tổng số rạp',
          value: cinemas.length
        }, {
          label: 'Số tỉnh/thành',
          value: cities.length
        }, {
          label: 'Tổng phòng chiếu',
          value: Object.values(roomsPerCinema).reduce((a, b) => a + b, 0)
        }].map(s => <Card key={s.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>)}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm rạp..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['all', ...cities].map(city => <Button key={city} variant={selectedCity === city ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCity(city)}>
                {city === 'all' ? 'Tất cả' : city}
              </Button>)}
          </div>
        </div>

        {/* Cinema Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(cinema => <Card key={cinema.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{cinema.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{cinema.address}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="w-4 h-4" /> Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Pencil className="w-4 h-4" /> Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4" /> Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{cinema.city}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {roomsPerCinema[cinema.id] ?? 0} phòng chiếu
                  </span>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    );
}
