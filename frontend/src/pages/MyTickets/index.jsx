"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import bookingApi from '@/api/bookingApi';
import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Ticket, Calendar, Clock, MapPin, Armchair, Download, Search, QrCode, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useNavigate, Navigate } from 'react-router-dom';

const STATUS = {
  upcoming: {
    label: 'Sắp chiếu',
    className: 'bg-blue-500/20 text-blue-400'
  },
  used: {
    label: 'Đã sử dụng',
    className: 'bg-secondary text-muted-foreground'
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-red-500/20 text-red-500'
  }
};

const TABS = [{
  id: 'all',
  label: 'Tất cả'
}, {
  id: 'upcoming',
  label: 'Sắp chiếu'
}, {
  id: 'used',
  label: 'Đã dùng'
}, {
  id: 'cancelled',
  label: 'Đã hủy'
}];

export default function MyTicketsPage() {
  const { isAuthenticated } = useAuth();
  const router = useNavigate();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated) {
      bookingApi.getMyBookings()
        .then(res => {
          if (res.success) {
            setMyTickets(res.data);
          }
        })
        .catch(err => console.error('Failed to fetch bookings:', err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }
  
  const filtered = myTickets.filter(t => {
    const status = t.status || 'upcoming';
    const matchTab = tab === 'all' || status === tab;
    const matchSearch = String(t.id).toLowerCase().includes(search.toLowerCase()) || (t.movieTitle ?? '').toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });
  
  return (
      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vé của tôi</h1>
            <p className="text-muted-foreground mt-1">Lịch sử đặt vé và vé sắp tới</p>
          </div>
          <Button asChild>
            <Link to="/movies">
              <Ticket className="w-4 h-4 mr-2" />
              Đặt vé mới
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
              {t.label}
              {t.id !== 'all' && <span className="ml-1.5 opacity-70">
                  {myTickets.filter(x => (x.status || 'upcoming') === t.id).length}
                </span>}
            </button>)}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm theo mã vé hoặc tên phim..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Ticket list */}
        {loading ? <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div> : filtered.length === 0 ? <div className="text-center py-16 text-muted-foreground">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Không có vé nào.</p>
          </div> : <div className="space-y-4">
            {filtered.map(ticket => {
          const status = STATUS[ticket.status || 'upcoming'];
          const displayDate = ticket.showDate ? new Date(ticket.showDate).toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'Unknown Date';
          
          return <Card key={ticket.id} className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Poster */}
                      <div className="w-20 shrink-0 bg-muted flex items-center justify-center">
                        <Ticket className="w-8 h-8 text-muted-foreground/30" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-4 space-y-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold leading-tight">{ticket.movieTitle}</h3>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">{ticket.id}</p>
                          </div>
                          <Badge className={status?.className}>{status?.label}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {displayDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ticket.showTime}
                          </div>
                          <div className="flex items-center gap-1 col-span-2 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{ticket.cinemaName} • {ticket.roomName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Armchair className="w-3 h-3" /> Ghế: {ticket.seatNumber}
                          </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            {ticket.totalAmount?.toLocaleString('vi-VN')}₫
                          </span>
                          <div className="flex gap-2 flex-wrap justify-end">
                            {(ticket.status === 'upcoming' || !ticket.status) && <>
                                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                                  <QrCode className="w-3 h-3" /> Xem vé
                                </Button>
                                {/* UC-45: Only show resell if not checked-in and showtime not started */}
                                {!ticket.checkedIn && <Button size="sm" variant="outline" className="h-7 gap-1 text-xs border-amber-500/50 text-amber-400 hover:bg-amber-500/10" asChild>
                                    <Link to={`/my-resale/create?bookingId=${ticket.id}`}>
                                      <RefreshCw className="w-3 h-3" /> Đăng bán lại
                                    </Link>
                                  </Button>}
                              </>}
                            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                              <Download className="w-3 h-3" /> PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>;
        })}
          </div>}
      </div>
  );
}
