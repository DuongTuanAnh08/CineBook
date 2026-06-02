"use client";

import { AdminLayout } from '@/components/layout';
import { useData } from '@/contexts/data-context'
import { getStaticSeatLayout } from '@/lib/seat-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Armchair, Settings } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
const PRICING = {
  standard: 75000,
  vip: 100000,
  couple: 180000
};

const SEAT_COLORS = {
  available: 'bg-secondary/60 hover:bg-primary/30 border-border',
  booked: 'bg-red-500/30 border-red-500/50 cursor-not-allowed',
  held: 'bg-yellow-500/30 border-yellow-500/50',
  standard: 'bg-secondary/60',
  vip: 'bg-yellow-500/20 border-yellow-500/40',
  couple: 'bg-pink-500/20 border-pink-500/40'
};
export default function AdminSeatsPage() {
  const { cinemas } = useData();
  const ROOM_OPTIONS = useMemo(() => cinemas.flatMap((c, ci) => Array.from({
    length: c.rooms || 1
  }).map((_, i) => ({
    id: `${c.id}-${i + 1}`,
    cinemaId: c.id,
    cinemaName: c.name,
    name: `Phòng ${i + 1}`,
    type: i === 0 ? 'IMAX' : '2D'
  }))), [cinemas]);
  const [selectedCinema, setSelectedCinema] = useState(cinemas[0]?.id || '');
  
  const currentCinemaRooms = useMemo(() => {
    return ROOM_OPTIONS.filter(r => r.cinemaId === selectedCinema);
  }, [ROOM_OPTIONS, selectedCinema]);

  const [selectedRoom, setSelectedRoom] = useState(currentCinemaRooms[0]?.id || '');

  const handleCinemaChange = (cinemaId) => {
    setSelectedCinema(cinemaId);
    const rooms = ROOM_OPTIONS.filter(r => r.cinemaId === cinemaId);
    if (rooms.length > 0) {
      setSelectedRoom(rooms[0].id);
    } else {
      setSelectedRoom('');
    }
  };
  const layout = useMemo(() => getStaticSeatLayout(PRICING), []);
  const totalSeats = layout.rows.reduce((acc, r) => acc + r.seats.length, 0);
  const bookedCount = layout.rows.reduce((acc, r) => acc + r.seats.filter(s => s.status === 'booked').length, 0);
  const vipCount = layout.rows.reduce((acc, r) => acc + r.seats.filter(s => s.type === 'vip').length, 0);
  const coupleCount = layout.rows.reduce((acc, r) => acc + r.seats.filter(s => s.type === 'couple').length, 0);
  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cấu hình Ghế ngồi</h1>
            <p className="text-muted-foreground mt-1">Quản lý sơ đồ và loại ghế trong từng phòng chiếu</p>
          </div>
          <Button className="gap-2">
            <Settings className="w-4 h-4" />
            Chỉnh sửa sơ đồ
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[{
          label: 'Tổng ghế',
          value: totalSeats
        }, {
          label: 'Ghế thường',
          value: totalSeats - vipCount - coupleCount
        }, {
          label: 'Ghế VIP',
          value: vipCount
        }, {
          label: 'Ghế đôi',
          value: coupleCount
        }].map(s => <Card key={s.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <Armchair className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>)}
        </div>

        {/* Room selector */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={selectedCinema} onValueChange={handleCinemaChange}>
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Chọn rạp" />
                </SelectTrigger>
                <SelectContent>
                  {cinemas.map(c => <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Chọn phòng chiếu" />
                </SelectTrigger>
                <SelectContent>
                  {currentCinemaRooms.map(r => <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <Badge variant="secondary">
                {ROOM_OPTIONS.find(r => r.id === selectedRoom)?.type}
              </Badge>
              <span className="text-sm text-muted-foreground ml-auto">
                {bookedCount}/{totalSeats} ghế đã đặt
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {/* Screen */}
            <div className="flex flex-col items-center gap-6 overflow-x-auto pb-2">
              <div className="w-4/5 h-2 bg-primary/60 rounded-full" />
              <p className="text-xs text-muted-foreground -mt-4">MÀN HÌNH</p>

              {/* Seat grid */}
              <div className="space-y-2">
                {layout.rows.map(row => <div key={row.row} className="flex items-center gap-1.5">
                    <span className="w-5 text-xs text-muted-foreground text-center">{row.row}</span>
                    <div className="flex gap-1.5">
                      {row.seats.map((seat, i) => {
                    const isAisle = !seat.type.includes('couple') && (i === 2 || i === 9);
                    return <div key={seat.id} className={cn('flex gap-1.5', isAisle && 'ml-3')}>
                            <div className={cn('w-6 h-6 rounded-t-sm text-[9px] flex items-center justify-center border cursor-pointer transition-colors', seat.status === 'booked' ? SEAT_COLORS.booked : seat.type === 'vip' ? SEAT_COLORS.vip : seat.type === 'couple' ? SEAT_COLORS.couple : SEAT_COLORS.available)} title={`${seat.id} — ${seat.type} — ${seat.status}`}>
                              {seat.number}
                            </div>
                          </div>;
                  })}
                    </div>
                  </div>)}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 text-xs text-muted-foreground mt-2">
                {[{
                color: 'bg-secondary/60 border border-border',
                label: 'Thường'
              }, {
                color: 'bg-yellow-500/20 border border-yellow-500/40',
                label: 'VIP'
              }, {
                color: 'bg-pink-500/20 border border-pink-500/40',
                label: 'Ghế đôi'
              }, {
                color: 'bg-red-500/30 border border-red-500/50',
                label: 'Đã đặt'
              }, {
                color: 'bg-yellow-500/30 border border-yellow-500/50',
                label: 'Đang giữ'
              }].map(l => <div key={l.label} className="flex items-center gap-1.5">
                    <div className={cn('w-4 h-4 rounded-t-sm', l.color)} />
                    {l.label}
                  </div>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}
