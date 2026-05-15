import { MainLayout } from '@/components/layout/main-layout'
import { movies, cinemas, genres } from '@/lib/mock-data'
import { MovieGrid } from '@/components/movies/movie-grid'

export default function NowShowingPage() {
  const nowShowing = movies.filter((m) => m.status === 'now_showing')
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <MovieGrid
          movies={nowShowing}
          genres={genres}
          cinemas={cinemas}
          title="Phim Đang Chiếu"
          subtitle={`${nowShowing.length} phim đang chiếu tại các rạp CineBook`}
        />
      </div>
    </MainLayout>
  )
}
