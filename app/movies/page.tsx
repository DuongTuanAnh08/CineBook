"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { MovieGrid } from '@/components/movies/movie-grid'
import { movies, genres, cinemas } from '@/lib/mock-data'

export default function MoviesPage() {
  return (
    <MainLayout>
      <div className="container py-8">
        <MovieGrid
          movies={movies}
          genres={genres}
          cinemas={cinemas}
          title="Danh sách phim"
          subtitle="Khám phá những bộ phim hay nhất đang chiếu và sắp ra mắt"
        />
      </div>
    </MainLayout>
  )
}
