"use client";

import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Armchair, Settings, Save, Loader2, RefreshCw } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import roomApi from '@/api/roomApi';

const SEAT_COLORS = {
  Hidden: 'opacity-0 pointer-events-none',
  Normal: 'bg-secondary/60 hover:bg-primary/30 border-border',
  VIP: 'bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/40',
  Couple: 'bg-pink-500/20 border-pink-500/40 hover:bg-pink-500/40',
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
    type: i === 0 ? 'IMAX' : '2D',
    roomId: null // In real app, this should be mapped to the actual DB room ID. We'll simulate fetching real room
  }))), [cinemas]);
  
  // Actually, we should fetch actual rooms from API. Let's use roomApi.
  const [realRooms, setRealRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [gridConfig, setGridConfig] = useState({ rows: 10, cols: 12 });

  useEffect(() => {
    // In a real app we would fetch all rooms, but we will mock realRooms if not available
    const fetchRooms = async () => {
      // Assuming GET /api/rooms returns list of rooms
      try {
        // Fallback to fetch room 1 if possible
        const res = await roomApi.getRoomSeats(1).catch(() => null);
        if (res && res.data) {
          // Just a test
        }
      } catch (e) {
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchSeats(selectedRoom);
    } else {
      setSeats([]);
    }
  }, [selectedRoom]);

  const fetchSeats = async (roomId) => {
    setIsLoading(true);
    try {
      const res = await roomApi.getRoomSeats(roomId);
      if (res.success) {
        setSeats(res.data || []);
      }
    } catch (error) {
      toast.error('Không thể tải sơ đồ ghế: ' + (error.response?.data?.error?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateGrid = () => {
    const newSeats = [];
    for (let r = 0; r < gridConfig.rows; r++) {
      const rowLabel = String.fromCharCode(65 + r); // A, B, C...
      for (let c = 1; c <= gridConfig.cols; c++) {
        newSeats.push({
          rowLabel: rowLabel,
          colNumber: c,
          seatLabel: `${rowLabel}${c}`,
          seatType: 'Normal'
        });
      }
    }
    setSeats(newSeats);
    setIsEditMode(true);
  };

  const handleSeatClick = (index) => {
    if (!isEditMode) return;
    const newSeats = [...seats];
    const currentType = newSeats[index].seatType;
    // Rotate: Normal -> VIP -> Couple -> Hidden -> Normal
    let nextType = 'Normal';
    if (currentType === 'Normal') nextType = 'VIP';
    else if (currentType === 'VIP') nextType = 'Couple';
    else if (currentType === 'Couple') nextType = 'Hidden';
    
    newSeats[index].seatType = nextType;
    setSeats(newSeats);
  };

  const handleSave = async () => {
    if (!selectedRoom) {
      toast.error("Vui lòng chọn phòng chiếu");
      return;
    }
    const payload = seats.filter(s => s.seatType !== 'Hidden').map(s => ({
      rowLabel: s.rowLabel,
      colNumber: s.colNumber,
      seatLabel: s.seatLabel,
      seatType: s.seatType
    }));

    setIsSaving(true);
    try {
      const res = await roomApi.configureSeats(selectedRoom, payload);
      if (res.success) {
        toast.success("Đã lưu sơ đồ ghế thành công!");
        setIsEditMode(false);
        setSeats(res.data);
      }
    } catch (error) {
      toast.error('Lỗi khi lưu sơ đồ: ' + (error.response?.data?.error?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  // Group seats by row
  const layoutRows = useMemo(() => {
    const grouped = {};
    seats.forEach(s => {
      if (!grouped[s.rowLabel]) grouped[s.rowLabel] = [];
      grouped[s.rowLabel].push(s);
    });
    // Sort by colNumber
    Object.values(grouped).forEach(rowSeats => {
      rowSeats.sort((a, b) => a.colNumber - b.colNumber);
    });
    return grouped;
  }, [seats]);

  const visibleSeats = seats.filter(s => s.seatType !== 'Hidden');
  const totalSeats = visibleSeats.length;
  const vipCount = visibleSeats.filter(s => s.seatType === 'VIP').length;
  const coupleCount = visibleSeats.filter(s => s.seatType === 'Couple').length;
  const normalCount = visibleSeats.filter(s => s.seatType === 'Normal').length;

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cấu hình Ghế ngồi</h1>
            <p className="text-muted-foreground mt-1">Vẽ sơ đồ và quản lý loại ghế trong phòng chiếu</p>
          </div>
          <div className="flex gap-2">
            {!isEditMode ? (
              <Button className="gap-2" onClick={() => setIsEditMode(true)}>
                <Settings className="w-4 h-4" />
                Chỉnh sửa sơ đồ
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { setIsEditMode(false); fetchSeats(selectedRoom); }}>Hủy</Button>
                <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu thay đổi
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[{
            label: 'Tổng ghế', value: totalSeats
          }, {
            label: 'Ghế thường', value: normalCount
          }, {
            label: 'Ghế VIP', value: vipCount
          }, {
            label: 'Ghế đôi', value: coupleCount
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Nhập Room ID để cấu hình:</span>
                <Input 
                  type="number" 
                  placeholder="ID (vd: 1)" 
                  value={selectedRoom} 
                  onChange={e => setSelectedRoom(e.target.value)} 
                  className="w-32"
                />
              </div>

              {isEditMode && (
                <div className="flex items-center gap-2 ml-auto p-2 bg-secondary/30 rounded-md border">
                  <span className="text-sm font-medium mr-2">Sinh sơ đồ mới:</span>
                  <Input type="number" placeholder="Số Hàng" className="w-20" value={gridConfig.rows} onChange={e => setGridConfig({...gridConfig, rows: parseInt(e.target.value) || 10})} />
                  <span>x</span>
                  <Input type="number" placeholder="Số Cột" className="w-20" value={gridConfig.cols} onChange={e => setGridConfig({...gridConfig, cols: parseInt(e.target.value) || 12})} />
                  <Button variant="secondary" size="sm" onClick={handleGenerateGrid}>
                    <RefreshCw className="w-4 h-4 mr-1" /> Sinh
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : seats.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <Armchair className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Chưa có sơ đồ ghế cho phòng chiếu này.</p>
                {isEditMode && <p className="text-sm mt-1">Vui lòng sử dụng công cụ "Sinh sơ đồ mới" ở góc trên bên phải.</p>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 overflow-x-auto pb-2">
                <div className="w-4/5 max-w-2xl h-2 bg-primary/60 rounded-full" />
                <p className="text-xs text-muted-foreground -mt-4">MÀN HÌNH</p>

                {/* Seat grid */}
                <div className="space-y-2">
                  {Object.keys(layoutRows).sort().map(rowLabel => (
                    <div key={rowLabel} className="flex items-center gap-1.5 justify-center">
                      <span className="w-5 text-xs text-muted-foreground text-center">{rowLabel}</span>
                      <div className="flex gap-1.5">
                        {layoutRows[rowLabel].map((seat) => {
                          const originalIndex = seats.findIndex(s => s.rowLabel === seat.rowLabel && s.colNumber === seat.colNumber);
                          return (
                            <div key={`${seat.rowLabel}${seat.colNumber}`} className="flex gap-1.5">
                              <div 
                                onClick={() => handleSeatClick(originalIndex)}
                                className={cn(
                                  'w-8 h-8 rounded-t-sm text-[10px] flex items-center justify-center border transition-colors select-none', 
                                  SEAT_COLORS[seat.seatType] || SEAT_COLORS.Normal,
                                  isEditMode && seat.seatType !== 'Hidden' ? 'cursor-pointer hover:ring-2 hover:ring-primary ring-offset-1' : '',
                                  isEditMode && seat.seatType === 'Hidden' ? 'opacity-30 cursor-pointer border-dashed bg-transparent' : ''
                                )} 
                                title={`${seat.seatLabel} — ${seat.seatType}`}
                              >
                                {seat.seatType !== 'Hidden' ? seat.colNumber : (isEditMode ? '+' : '')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <span className="w-5 text-xs text-muted-foreground text-center">{rowLabel}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center flex-wrap gap-6 text-xs text-muted-foreground mt-6 pt-4 border-t w-full">
                  {[{
                    color: 'bg-secondary/60 border border-border',
                    label: 'Thường'
                  }, {
                    color: 'bg-yellow-500/20 border border-yellow-500/40',
                    label: 'VIP'
                  }, {
                    color: 'bg-pink-500/20 border border-pink-500/40',
                    label: 'Ghế đôi'
                  }].map(l => <div key={l.label} className="flex items-center gap-1.5">
                      <div className={cn('w-4 h-4 rounded-t-sm', l.color)} />
                      {l.label}
                    </div>)}
                    
                  {isEditMode && (
                    <div className="flex items-center gap-1.5 border-l pl-6 ml-2">
                      <span className="font-medium text-foreground">Mẹo:</span> 
                      Click vào ghế để đổi loại (Thường → VIP → Đôi → Ẩn lối đi)
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
