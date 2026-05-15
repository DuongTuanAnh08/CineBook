"use client"

import { AdminLayout } from '@/components/layout'
import { movies, cinemas, generateShowtimes } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Calendar, Plus, MoreHorizontal, Pencil, Trash2, Clock } from 'lucide-react'
import { useState, useMemo } from 'react'

const TODAY = new Date().toISOString().split('T')[0]

export default function AdminShowtimesPage() {
  const [selectedMovie, setSelectedMovie] = useState<string>('all')
  const [selectedCinema, setSelectedCinema] = useState<string>('all')

  const allShowtimes = useMemo(() => {
    const result = movies.flatMap((m) => generateShowtimes(m.id, TODAY))
    return result
  }, [])

  const filtered = allShowtimes.filter((s) => {
    const matchMovie = selectedMovie === 'all' || s.movieId === selectedMovie
    const matchCinema = selectedCinema === 'all' || s.cinemaId === selectedCinema
    return matchMovie && matchCinema
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lịch chiếu</h1>
            <p className="text-muted-foreground mt-1">Quản lý suất chiếu phim tại các rạp</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm suất chiếu
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Tổng suất chiếu hôm nay', value: allShowtimes.length },
            {
              label: 'Tổng ghế trống',
              value: allShowtimes.reduce((acc, s) => acc + s.availableSeats, 0).toLocaleString(),
            },
            {
              label: 'Công suất trung bình',
              value:
                allShowtimes.length > 0
                  ? Math.round(
                      (1 -
                        allShowtimes.reduce((acc, s) => acc + s.availableSeats, 0) /
                          allShowtimes.reduce((acc, s) => acc + s.totalSeats, 0)) *
                        100,
                    ) + '%'
                  : '0%',
            },
          ].map((s) => (
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

        {/* Filters + Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={selectedMovie} onValueChange={setSelectedMovie}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Chọn phim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phim</SelectItem>
                  {movies.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCinema} onValueChange={setSelectedCinema}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Chọn rạp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả rạp</SelectItem>
                  {cinemas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-auto">
                {filtered.length} suất chiếu
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Phim</TableHead>
                  <TableHead>Rạp</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Giờ chiếu</TableHead>
                  <TableHead>Ghế trống</TableHead>
                  <TableHead>Giá vé</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 30).map((s) => {
                  const movie = movies.find((m) => m.id === s.movieId)
                  const occupancy = Math.round((1 - s.availableSeats / s.totalSeats) * 100)
                  return (
                    <TableRow key={s.id} className="border-border">
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {movie?.title}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.cinemaName}</TableCell>
                      <TableCell className="text-sm">{s.roomName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {s.startTime} – {s.endTime}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.availableSeats}/{s.totalSeats}
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.price.toLocaleString('vi-VN')}₫
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            occupancy >= 80
                              ? 'bg-red-500/20 text-red-500'
                              : occupancy >= 50
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-green-500/20 text-green-500'
                          }
                        >
                          {occupancy}% lấp đầy
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
                              <Trash2 className="w-4 h-4" /> Hủy suất chiếu
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
