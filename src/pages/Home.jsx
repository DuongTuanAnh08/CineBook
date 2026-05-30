"use client"


import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { Play, Users, Shield, UserCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useData } from '@/contexts/data-context'
import { MovieCard } from '@/components/movies/movie-card'

export default function HomePage() {
  const { movies } = useData();
  const { user, isAuthenticated, setMockUser } = useAuth()

  const handleRoleChange = (role) => {
    setMockUser(role)
  }

  return (
    
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4 border-primary text-primary">
                Chào mừng đến CineBook
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                Trải nghiệm{' '}
                <span className="text-primary">điện ảnh</span>{' '}
                đỉnh cao
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                Đặt vé xem phim nhanh chóng, tiện lợi với hệ thống rạp chiếu phim hiện đại. 
                Khám phá những bộ phim bom tấn và nhận ngay ưu đãi hấp dẫn.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link to="/movies">
                    <Play className="w-5 h-5 mr-2" />
                    Đặt vé ngay
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/movies">
                    Xem lịch chiếu
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Controls - For testing Auth States */}
        <section className="py-8 border-y border-border bg-card/50">
          <div className="container mx-auto px-4">
            <Card className="bg-secondary/30 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Demo: Chuyển đổi trạng thái đăng nhập
                </CardTitle>
                <CardDescription>
                  Click vào các nút bên dưới để xem giao diện thay đổi theo từng loại người dùng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={!isAuthenticated ? 'default' : 'outline'}
                    onClick={() => handleRoleChange('guest')}
                    className={!isAuthenticated ? 'bg-primary hover:bg-primary/90' : ''}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Guest (Khách)
                  </Button>
                  <Button
                    variant={user?.role === 'user' ? 'default' : 'outline'}
                    onClick={() => handleRoleChange('user')}
                    className={user?.role === 'user' ? 'bg-primary hover:bg-primary/90' : ''}
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    User (Khách hàng)
                  </Button>
                  <Button
                    variant={user?.role === 'admin' ? 'default' : 'outline'}
                    onClick={() => handleRoleChange('admin')}
                    className={user?.role === 'admin' ? 'bg-primary hover:bg-primary/90' : ''}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin (Quản trị viên)
                  </Button>
                  <Button
                    variant={user?.role === 'manager' ? 'default' : 'outline'}
                    onClick={() => handleRoleChange('manager')}
                    className={user?.role === 'manager' ? 'bg-primary hover:bg-primary/90' : ''}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Manager (Quản lý)
                  </Button>
                </div>
                
                {/* Current State Display */}
                <Separator className="my-4 bg-border" />
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Trạng thái hiện tại:</span>
                  {isAuthenticated && user ? (
                    <Badge variant="outline" className="border-primary text-primary">
                      Đã đăng nhập: {user.name} ({user.role})
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Chưa đăng nhập (Guest)
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Featured Movies - Now Showing */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Phim Đang Chiếu</h2>
                <p className="text-muted-foreground">Những bộ phim hot nhất tại rạp</p>
              </div>
              <Button variant="outline" className="hidden sm:inline-flex" asChild>
                <Link to="/movies?status=now_showing">
                  Xem tất cả
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.filter(m => m.status === 'now_showing').slice(0, 5).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Movies */}
        <section className="py-12 bg-card/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Phim Sắp Chiếu</h2>
                <p className="text-muted-foreground">Đừng bỏ lỡ những bom tấn sắp ra mắt</p>
              </div>
              <Button variant="outline" className="hidden sm:inline-flex" asChild>
                <Link to="/movies?status=coming_soon">
                  Xem tất cả
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.filter(m => m.status === 'coming_soon').slice(0, 5).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </section>
      </div>
    
  )
}
