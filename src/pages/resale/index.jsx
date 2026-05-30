'use client';

import { useState, useMemo } from 'react';

import { useData } from '@/contexts/data-context'
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Armchair, Search, Tag, RefreshCw, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
const TICKET_TYPE_LABELS = {
  standard: 'Thường',
  vip: 'VIP',
  couple: 'Couple'
};
const TICKET_TYPE_COLORS = {
  standard: 'bg-secondary text-foreground',
  vip: 'bg-amber-500/20 text-amber-400',
  couple: 'bg-pink-500/20 text-pink-400'
};

// BR-23: Only ACTIVE listings visible to Guest/Customer


// Unique filter options derived from data


export default function ResaleTicketPage() {
  const { resaleListings } = useData();
  const activeListings = (resaleListings || []).filter(l => l.status === 'active');
  const uniqueMovies = [...new Set(activeListings.map(l => l.movieTitle))];
  const uniqueCinemas = [...new Set(activeListings.map(l => l.cinemaName))];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMovie, setFilterMovie] = useState('all');
  const [filterCinema, setFilterCinema] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const filtered = useMemo(() => {
    let result = [...activeListings];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => l.movieTitle.toLowerCase().includes(q) || l.cinemaName.toLowerCase().includes(q) || l.sellerName.toLowerCase().includes(q));
    }
    if (filterMovie !== 'all') result = result.filter(l => l.movieTitle === filterMovie);
    if (filterCinema !== 'all') result = result.filter(l => l.cinemaName === filterCinema);
    if (filterType !== 'all') result = result.filter(l => l.ticketType === filterType);
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.resalePrice - b.resalePrice;
      if (sortBy === 'price_desc') return b.resalePrice - a.resalePrice;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [searchQuery, filterMovie, filterCinema, filterType, sortBy]);
  const clearFilters = () => {
    setSearchQuery('');
    setFilterMovie('all');
    setFilterCinema('all');
    setFilterType('all');
    setSortBy('newest');
  };
  const hasFilters = searchQuery || filterMovie !== 'all' || filterCinema !== 'all' || filterType !== 'all';
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Vé Bán Lại</h1>
          </div>
          <p className="text-muted-foreground">
            Tìm vé được đăng bán lại bởi người dùng CineBook.{' '}
            <span className="text-amber-400 font-medium">
              ⚠️ Hệ thống chỉ hỗ trợ đăng thông tin, không xử lý giao dịch.
            </span>
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="resale-search" placeholder="Tìm theo tên phim, rạp, người bán..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />

            <Select value={filterMovie} onValueChange={setFilterMovie}>
              <SelectTrigger className="h-8 w-auto min-w-[140px] text-xs">
                <SelectValue placeholder="Phim" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phim</SelectItem>
                {uniqueMovies.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterCinema} onValueChange={setFilterCinema}>
              <SelectTrigger className="h-8 w-auto min-w-[140px] text-xs">
                <SelectValue placeholder="Rạp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả rạp</SelectItem>
                {uniqueCinemas.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={v => setFilterType(v)}>
              <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
                <SelectValue placeholder="Loại vé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Loại vé</SelectItem>
                <SelectItem value="standard">Thường</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={v => setSortBy(v)}>
              <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price_asc">Giá tăng dần</SelectItem>
                <SelectItem value="price_desc">Giá giảm dần</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs gap-1 text-muted-foreground">
                <RefreshCw className="w-3 h-3" />
                Xóa bộ lọc
              </Button>}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Hiển thị <span className="text-foreground font-medium">{filtered.length}</span> vé
        </p>

        {/* Listing grid */}
        {filtered.length === 0 ? <div className="text-center py-20 text-muted-foreground">
            <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Không có vé nào phù hợp.</p>
            <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm khác.</p>
          </div> : <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map(listing => {
          const displayDate = new Date(listing.showDate).toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          return <Card key={listing.id} className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors group">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Poster */}
                      <div className="w-20 shrink-0">
                        <img src={listing.moviePoster} alt={listing.movieTitle} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-4 space-y-2.5 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm leading-tight line-clamp-2">
                            {listing.movieTitle}
                          </h3>
                          <Badge className={cn('shrink-0 text-xs', TICKET_TYPE_COLORS[listing.ticketType])}>
                            {TICKET_TYPE_LABELS[listing.ticketType]}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{listing.cinemaName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {displayDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {listing.showTime}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Armchair className="w-3 h-3" />
                            Ghế {listing.seatNumber} • {listing.roomName}
                          </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground line-through">
                              Gốc: {listing.originalPrice.toLocaleString('vi-VN')}₫
                            </p>
                            <p className="font-bold text-primary">
                              {listing.resalePrice.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                          <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1 group-hover:border-primary/50">
                            <Link to={`/resale/${listing.id}`}>
                              Chi tiết
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </Button>
                        </div>

                        {listing.note && <p className="text-xs text-muted-foreground italic line-clamp-1 flex items-start gap-1">
                            <Tag className="w-3 h-3 shrink-0 mt-0.5" />
                            {listing.note}
                          </p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>;
        })}
          </div>}
      </div>
    );
}
