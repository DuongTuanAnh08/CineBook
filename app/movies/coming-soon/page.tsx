import { MainLayout } from '@/components/layout/main-layout'
import { movies, cinemas, genres } from '@/lib/mock-data'
import { MovieGrid } from '@/components/movies/movie-grid'

export default function ComingSoonPage() {
  const comingSoon = movies.filter((m) => m.status === 'coming_soon')
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <MovieGrid
          movies={comingSoon}
          genres={genres}
          cinemas={cinemas}
          title="Phim Sắp Chiếu"
          subtitle={`${comingSoon.length} phim sắp ra mắt — đặt vé trước ngay hôm nay`}
        />
      </div>
    </MainLayout>
  )
}
