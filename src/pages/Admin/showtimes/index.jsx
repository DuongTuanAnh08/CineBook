"use client";

import { AdminLayout } from '@/components/layout';
import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, MoreHorizontal, Pencil, Trash2, Clock, List, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';

const TODAY = new Date().toISOString().split('T')[0];

export default function AdminShowtimesPage() {
  const { movies, cinemas, showtimes, addShowtime, updateShowtime, deleteShowtime } = useData();
  const [selectedMovie, setSelectedMovie] = useState('all');
  const [selectedCinema, setSelectedCinema] = useState('all');
  const [selectedDate, setSelectedDate] = useState(TODAY);

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    movieId: '', cinemaId: '', roomName: 'Phòng 1', date: TODAY, startTime: '09:00', price: 90000
  });

  const filtered = showtimes.filter(s => {
    const matchMovie = selectedMovie === 'all' || s.movieId === selectedMovie;
    const matchCinema = selectedCinema === 'all' || s.cinemaId === selectedCinema;
    const matchDate = s.date === selectedDate;
    return matchMovie && matchCinema && matchDate;
  });

  const openAdd = () => {
    setEditingShowtime(null);
    setFormData({ movieId: movies[0]?.id || '', cinemaId: cinemas[0]?.id || '', roomName: 'Phòng 1', date: selectedDate, startTime: '09:00', price: 90000 });
    setErrorMsg('');
    setIsDialogOpen(true);
  };

  const openEdit = (showtime) => {
    setEditingShowtime(showtime);
    setFormData({ 
      movieId: showtime.movieId, 
      cinemaId: showtime.cinemaId, 
      roomName: showtime.roomName, 
      date: showtime.date, 
      startTime: showtime.startTime, 
      price: showtime.price 
    });
    setErrorMsg('');
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    setErrorMsg('');
    try {
      const movie = movies.find(m => m.id === formData.movieId);
      const cinema = cinemas.find(c => c.id === formData.cinemaId);
      
      const duration = movie?.duration || 120;
      const [hours, minutes] = formData.startTime.split(':').map(Number);
      const endHours = hours + Math.floor((minutes + duration) / 60);
      const endMinutes = (minutes + duration) % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

      const payload = {
        movieId: formData.movieId,
        cinemaId: formData.cinemaId,
        cinemaName: cinema.name,
        roomName: formData.roomName,
        date: formData.date,
        startTime: formData.startTime,
        endTime,
        price: Number(formData.price),
        availableSeats: editingShowtime ? editingShowtime.availableSeats : 120,
        totalSeats: 120
      };

      if (editingShowtime) {
        updateShowtime(editingShowtime.id, payload);
      } else {
        addShowtime(payload);
      }
      setIsDialogOpen(false);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteShowtime(deletingId);
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Lịch chiếu</h1>
          <p className="text-muted-foreground mt-1">Sắp xếp lịch chiếu, kiểm tra trùng lặp thời gian trống</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Thêm suất chiếu
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: `Tổng suất chiếu ngày ${selectedDate}`,
            value: filtered.length
          }, {
            label: 'Tổng ghế trống',
            value: filtered.reduce((acc, s) => acc + s.availableSeats, 0).toLocaleString()
          }, {
            label: 'Công suất trung bình',
            value: filtered.length > 0 ? Math.round((1 - filtered.reduce((acc, s) => acc + s.availableSeats, 0) / filtered.reduce((acc, s) => acc + s.totalSeats, 0)) * 100) + '%' : '0%'
          }
        ].map(s => (
          <Card key={s.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content (Tabs) */}
      <Card className="bg-card border-border">
        <Tabs defaultValue="list">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                className="w-40"
              />
              <Select value={selectedMovie} onValueChange={setSelectedMovie}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn phim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phim</SelectItem>
                  {movies.filter(m => m.status === 'now_showing').map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCinema} onValueChange={setSelectedCinema}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn rạp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả rạp</SelectItem>
                  {cinemas.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <TabsList>
              <TabsTrigger value="list" className="gap-2"><List className="w-4 h-4" /> Danh sách</TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2"><Calendar className="w-4 h-4" /> Lịch phòng</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent className="p-0">
            <TabsContent value="list" className="m-0 border-t border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Phim</TableHead>
                    <TableHead>Rạp</TableHead>
                    <TableHead>Phòng</TableHead>
                    <TableHead>Giờ chiếu</TableHead>
                    <TableHead>Ghế trống</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Không có suất chiếu nào
                      </TableCell>
                    </TableRow>
                  ) : filtered.map(s => {
                    const movie = movies.find(m => m.id === s.movieId);
                    const occupancy = Math.round((1 - s.availableSeats / s.totalSeats) * 100);
                    return (
                      <TableRow key={s.id} className="border-border">
                        <TableCell className="font-medium max-w-[200px] truncate">{movie?.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.cinemaName}</TableCell>
                        <TableCell className="text-sm font-semibold text-primary">{s.roomName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {s.startTime} – {s.endTime}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{s.availableSeats}/{s.totalSeats}</TableCell>
                        <TableCell>
                          <Badge className={occupancy >= 80 ? 'bg-red-500/20 text-red-500' : occupancy >= 50 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}>
                            {occupancy}% lấp đầy
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2" onClick={() => openEdit(s)}>
                                <Pencil className="w-4 h-4" /> Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => confirmDelete(s.id)}>
                                <Trash2 className="w-4 h-4" /> Hủy suất chiếu
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="calendar" className="m-0 border-t border-border p-6 overflow-x-auto">
              {/* Simple Timeline View */}
              <div className="min-w-[800px]">
                {selectedCinema === 'all' ? (
                  <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                    Vui lòng chọn 1 rạp chiếu cụ thể để xem Lịch phòng (Timeline)
                  </div>
                ) : (
                  <div className="space-y-4">
                    {['Phòng 1', 'Phòng 2', 'Phòng 3'].map(room => {
                      const roomShowtimes = filtered.filter(s => s.roomName === room).sort((a, b) => a.startTime.localeCompare(b.startTime));
                      return (
                        <div key={room} className="flex flex-col gap-2 p-4 bg-muted/20 rounded-lg border border-border">
                          <h3 className="font-bold text-primary">{room}</h3>
                          <div className="flex gap-2 relative h-16 w-full rounded bg-secondary/30 items-center px-2 overflow-x-auto">
                            {roomShowtimes.length === 0 && <span className="text-xs text-muted-foreground absolute left-1/2 -translate-x-1/2">Trống toàn bộ</span>}
                            {roomShowtimes.map(s => {
                              const movie = movies.find(m => m.id === s.movieId);
                              // Calculate position simply (08:00 = 0%, 24:00 = 100%)
                              const getMins = t => {
                                const [h, m] = t.split(':').map(Number);
                                return h * 60 + m;
                              };
                              const dayStart = 8 * 60; // 08:00
                              const dayEnd = 24 * 60;
                              const totalMins = dayEnd - dayStart;
                              
                              const start = Math.max(0, getMins(s.startTime) - dayStart);
                              const end = Math.min(totalMins, getMins(s.endTime) - dayStart);
                              const width = (end - start) / totalMins * 100;
                              const left = start / totalMins * 100;
                              
                              return (
                                <div 
                                  key={s.id} 
                                  className="absolute h-10 bg-primary/20 border border-primary/50 text-primary rounded-md flex flex-col justify-center px-2 shadow-sm text-xs cursor-pointer hover:bg-primary/30 transition-colors"
                                  style={{ left: `${left}%`, width: `${width}%` }}
                                  onClick={() => openEdit(s)}
                                >
                                  <span className="font-bold truncate">{movie?.title}</span>
                                  <span>{s.startTime} - {s.endTime}</span>
                                </div>
                              );
                            })}
                          </div>
                          {/* Time markers */}
                          <div className="flex justify-between text-[10px] text-muted-foreground px-2">
                            <span>08:00</span>
                            <span>12:00</span>
                            <span>16:00</span>
                            <span>20:00</span>
                            <span>24:00</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingShowtime ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu mới'}</DialogTitle>
          </DialogHeader>
          
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-500 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Rạp chiếu</Label>
              <Select value={formData.cinemaId} onValueChange={v => setFormData({ ...formData, cinemaId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cinemas.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phòng chiếu</Label>
                <Select value={formData.roomName} onValueChange={v => setFormData({ ...formData, roomName: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Phòng 1', 'Phòng 2', 'Phòng 3'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Phim</Label>
                <Select value={formData.movieId} onValueChange={v => setFormData({ ...formData, movieId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {movies.filter(m => m.status === 'now_showing').map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Giờ bắt đầu</Label>
                <Input type="time" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Giá vé (VNĐ)</Label>
                <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu thông tin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hủy suất chiếu này?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Hành động này sẽ hủy suất chiếu và không thể khôi phục. Tiếp tục?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Không</Button>
            <Button variant="destructive" onClick={handleDelete}>Hủy suất chiếu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
