"use client"

import { AdminLayout } from '@/components/layout'
import { movies } from '@/lib/mock-data'
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
import { Film, Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function AdminMoviesPage() {
  const [search, setSearch] = useState('')

  const filtered = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.originalTitle ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Phim</h1>
            <p className="text-muted-foreground mt-1">Quản lý danh sách phim đang chiếu và sắp chiếu</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm phim mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Tổng số phim', value: movies.length, icon: Film },
            { label: 'Đang chiếu', value: movies.filter((m) => m.status === 'now_showing').length, icon: Film },
            { label: 'Sắp chiếu', value: movies.filter((m) => m.status === 'coming_soon').length, icon: Film },
          ].map((s) => (
            <Card key={s.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="w-4 h-4 text-muted-foreground" />
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
                  placeholder="Tìm kiếm phim..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-16">Poster</TableHead>
                  <TableHead>Tên phim</TableHead>
                  <TableHead>Thể loại</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((movie) => (
                  <TableRow key={movie.id} className="border-border">
                    <TableCell>
                      <div className="relative w-10 h-14 rounded overflow-hidden bg-secondary">
                        <Image
                          src={movie.poster}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{movie.title}</p>
                        {movie.originalTitle && (
                          <p className="text-xs text-muted-foreground">{movie.originalTitle}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {movie.genres.slice(0, 2).map((g) => (
                          <Badge key={g} variant="secondary" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{movie.duration} phút</TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-yellow-500">★ {movie.rating}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          movie.status === 'now_showing'
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                            : 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'
                        }
                      >
                        {movie.status === 'now_showing' ? 'Đang chiếu' : 'Sắp chiếu'}
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
