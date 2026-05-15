import type { Movie, Cinema, Showtime, Genre } from '@/types/movie'

export const genres: Genre[] = [
  { id: '1', name: 'Hành động', slug: 'action' },
  { id: '2', name: 'Phiêu lưu', slug: 'adventure' },
  { id: '3', name: 'Hoạt hình', slug: 'animation' },
  { id: '4', name: 'Hài hước', slug: 'comedy' },
  { id: '5', name: 'Tội phạm', slug: 'crime' },
  { id: '6', name: 'Tâm lý', slug: 'drama' },
  { id: '7', name: 'Gia đình', slug: 'family' },
  { id: '8', name: 'Kinh dị', slug: 'horror' },
  { id: '9', name: 'Lãng mạn', slug: 'romance' },
  { id: '10', name: 'Khoa học viễn tưởng', slug: 'sci-fi' },
]

export const cinemas: Cinema[] = [
  { id: '1', name: 'CineBook Vincom Mega Mall', address: '72 Lê Thánh Tôn, Q.1', city: 'Hồ Chí Minh' },
  { id: '2', name: 'CineBook Landmark 81', address: '208 Nguyễn Hữu Cảnh, Bình Thạnh', city: 'Hồ Chí Minh' },
  { id: '3', name: 'CineBook Royal City', address: '72A Nguyễn Trãi, Thanh Xuân', city: 'Hà Nội' },
  { id: '4', name: 'CineBook Aeon Mall', address: '30 Bờ Bao Tân Thắng, Tân Phú', city: 'Hồ Chí Minh' },
  { id: '5', name: 'CineBook Times City', address: '458 Minh Khai, Hai Bà Trưng', city: 'Hà Nội' },
]

export const movies: Movie[] = [
  {
    id: '1',
    title: 'Điệp Viên 007: Không Thời Gian Để Chết',
    originalTitle: 'No Time to Die',
    poster: 'https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/r2GAjd4rNOHJh6i6Y0FntmYuPQW.jpg',
    trailer: 'BIhNsAtPbPI',
    rating: 4.5,
    duration: 163,
    releaseDate: '2024-01-15',
    status: 'now_showing',
    genres: ['Hành động', 'Phiêu lưu', 'Tội phạm'],
    description: 'James Bond đã rời khỏi sứ mệnh và đang tận hưởng cuộc sống yên bình tại Jamaica. Tuy nhiên, sự yên bình ngắn ngủi của anh kết thúc khi người bạn cũ Felix Leiter của CIA xuất hiện và nhờ giúp đỡ.',
    director: 'Cary Joji Fukunaga',
    cast: [
      { id: '1', name: 'Daniel Craig', role: 'James Bond', avatar: 'https://image.tmdb.org/t/p/w200/iFerDyUXvZLlVGfEfVwHsZnVIQa.jpg' },
      { id: '2', name: 'Ana de Armas', role: 'Paloma', avatar: 'https://image.tmdb.org/t/p/w200/3vxvsmYLTf4jnr163SUlBIw51ee.jpg' },
      { id: '3', name: 'Rami Malek', role: 'Safin', avatar: 'https://image.tmdb.org/t/p/w200/eWJJlqsiLzxh3XxTe7GDKsYUJgg.jpg' },
    ],
    ageRating: 'C16',
  },
  {
    id: '2',
    title: 'Dune: Hành Tinh Cát - Phần 2',
    originalTitle: 'Dune: Part Two',
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    trailer: 'Way9Dexny3w',
    rating: 4.8,
    duration: 166,
    releaseDate: '2024-03-01',
    status: 'now_showing',
    genres: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Tâm lý'],
    description: 'Paul Atreides hợp nhất với Chani và người Fremen trong khi đang trên con đường báo thù những kẻ âm mưu đã phá hủy gia đình của mình.',
    director: 'Denis Villeneuve',
    cast: [
      { id: '4', name: 'Timothée Chalamet', role: 'Paul Atreides', avatar: 'https://image.tmdb.org/t/p/w200/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
      { id: '5', name: 'Zendaya', role: 'Chani', avatar: 'https://image.tmdb.org/t/p/w200/tylFevAKiQF3yP7rOmhqEt4ewmH.jpg' },
      { id: '6', name: 'Rebecca Ferguson', role: 'Lady Jessica', avatar: 'https://image.tmdb.org/t/p/w200/lJloTOheuQSirSLXNA3JHsrMNfH.jpg' },
    ],
    ageRating: 'C13',
  },
  {
    id: '3',
    title: 'Kungfu Panda 4',
    originalTitle: 'Kung Fu Panda 4',
    poster: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/kYgQzzjNis5jJalYtIHgrom0gOx.jpg',
    trailer: '_inKs4eeHiI',
    rating: 4.2,
    duration: 94,
    releaseDate: '2024-03-08',
    status: 'now_showing',
    genres: ['Hoạt hình', 'Hài hước', 'Gia đình'],
    description: 'Po được chọn làm Lãnh đạo Tinh thần của Thung lũng Hòa Bình, nhưng cần tìm và đào tạo một Chiến binh Rồng mới trước khi nhận vai trò mới.',
    director: 'Mike Mitchell',
    cast: [
      { id: '7', name: 'Jack Black', role: 'Po (giọng nói)', avatar: 'https://image.tmdb.org/t/p/w200/rtCx0fiYxJVhzXXdwZE2XRTfIKE.jpg' },
      { id: '8', name: 'Awkwafina', role: 'Zhen (giọng nói)', avatar: 'https://image.tmdb.org/t/p/w200/l5AKkg3H1QhMuXmTTmq1EyjyiRb.jpg' },
    ],
    ageRating: 'P',
  },
  {
    id: '4',
    title: 'Godzilla x Kong: Đế Chế Mới',
    originalTitle: 'Godzilla x Kong: The New Empire',
    poster: 'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/veIyxxi5Gs8gvztLEW1Zrgj0ue2.jpg',
    trailer: 'lV1OOlGwExM',
    rating: 4.0,
    duration: 115,
    releaseDate: '2024-03-29',
    status: 'now_showing',
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
    description: 'Hai titan huyền thoại, Godzilla và Kong, đối mặt với một mối đe dọa khổng lồ chưa từng được biết đến ẩn giấu trong thế giới của chúng ta.',
    director: 'Adam Wingard',
    cast: [
      { id: '9', name: 'Rebecca Hall', role: 'Dr. Ilene Andrews', avatar: 'https://image.tmdb.org/t/p/w200/n2TGXP1jVoPoQqPxTOsvN3yX1oz.jpg' },
      { id: '10', name: 'Brian Tyree Henry', role: 'Bernie Hayes', avatar: 'https://image.tmdb.org/t/p/w200/zrFjU4xqQjR5YF4J2KhPyeFAqCi.jpg' },
    ],
    ageRating: 'C13',
  },
  {
    id: '5',
    title: 'Venom: Kẻ Thù Cuối Cùng',
    originalTitle: 'Venom: The Last Dance',
    poster: 'https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg',
    trailer: '__2bjWbetsA',
    rating: 4.3,
    duration: 140,
    releaseDate: '2024-10-25',
    status: 'coming_soon',
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Tội phạm'],
    description: 'Eddie và Venom đang chạy trốn. Bị cả hai thế giới truy đuổi, bộ đôi buộc phải đưa ra một quyết định tàn khốc sẽ đưa màn cuối cùng của Venom và Eddie xuống.',
    director: 'Kelly Marcel',
    cast: [
      { id: '11', name: 'Tom Hardy', role: 'Eddie Brock / Venom', avatar: 'https://image.tmdb.org/t/p/w200/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg' },
      { id: '12', name: 'Chiwetel Ejiofor', role: 'Rex Strickland', avatar: 'https://image.tmdb.org/t/p/w200/jcuPa6S9C1yEnPfOGKwm9NxONFZ.jpg' },
    ],
    ageRating: 'C16',
  },
  {
    id: '6',
    title: 'Deadpool & Wolverine',
    originalTitle: 'Deadpool & Wolverine',
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    trailer: '73_1biulkYk',
    rating: 4.7,
    duration: 127,
    releaseDate: '2024-07-26',
    status: 'coming_soon',
    genres: ['Hành động', 'Hài hước', 'Khoa học viễn tưởng'],
    description: 'Deadpool được Time Variance Authority tuyển dụng để giúp bảo vệ đa vũ trụ.',
    director: 'Shawn Levy',
    cast: [
      { id: '13', name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool', avatar: 'https://image.tmdb.org/t/p/w200/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg' },
      { id: '14', name: 'Hugh Jackman', role: 'Logan / Wolverine', avatar: 'https://image.tmdb.org/t/p/w200/4Xujtewxqt6aU0Y81tsS9gkjizk.jpg' },
    ],
    ageRating: 'C18',
  },
  {
    id: '7',
    title: 'Nhà Bà Nữ',
    originalTitle: 'Nhà Bà Nữ',
    poster: 'https://image.tmdb.org/t/p/w500/bLMJYHrHaOFnqPY0HZjxrXHwlLZ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/vFyJH02dTdFBmwcK3dqFGmOxvJT.jpg',
    trailer: 'R87WbOxhHQI',
    rating: 4.1,
    duration: 118,
    releaseDate: '2024-02-14',
    status: 'now_showing',
    genres: ['Hài hước', 'Tâm lý', 'Gia đình'],
    description: 'Câu chuyện hài hước về một gia đình Việt Nam với những mâu thuẫn thế hệ và tình yêu thương.',
    director: 'Trấn Thành',
    cast: [
      { id: '15', name: 'Trấn Thành', role: 'Đại Nghĩa', avatar: '' },
      { id: '16', name: 'Lê Giang', role: 'Bà Nữ', avatar: '' },
    ],
    ageRating: 'C13',
  },
  {
    id: '8',
    title: 'Inside Out 2',
    originalTitle: 'Inside Out 2',
    poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg',
    trailer: 'LEjhY15eCx0',
    rating: 4.6,
    duration: 96,
    releaseDate: '2024-06-14',
    status: 'coming_soon',
    genres: ['Hoạt hình', 'Hài hước', 'Gia đình'],
    description: 'Riley bước vào tuổi dậy thì và đối mặt với những cảm xúc mới hoàn toàn.',
    director: 'Kelsey Mann',
    cast: [
      { id: '17', name: 'Amy Poehler', role: 'Joy (giọng nói)', avatar: 'https://image.tmdb.org/t/p/w200/rwmvRonpluV6dCPiQissYpUfYdO.jpg' },
      { id: '18', name: 'Maya Hawke', role: 'Anxiety (giọng nói)', avatar: 'https://image.tmdb.org/t/p/w200/nIaN0LZJEev5u2w7sR3S6mPYoFM.jpg' },
    ],
    ageRating: 'P',
  },
]

export function generateShowtimes(movieId: string, date: string): Showtime[] {
  const times = ['09:30', '11:45', '14:00', '16:15', '18:30', '20:45', '23:00']
  const showtimes: Showtime[] = []

  cinemas.forEach((cinema) => {
    const roomCount = Math.floor(Math.random() * 2) + 1
    for (let room = 1; room <= roomCount; room++) {
      const selectedTimes = times.filter(() => Math.random() > 0.4)
      selectedTimes.forEach((time, index) => {
        const [hours, minutes] = time.split(':').map(Number)
        const movie = movies.find((m) => m.id === movieId)
        const duration = movie?.duration || 120
        const endHours = hours + Math.floor((minutes + duration) / 60)
        const endMinutes = (minutes + duration) % 60

        showtimes.push({
          id: `${movieId}-${cinema.id}-${room}-${index}`,
          movieId,
          cinemaId: cinema.id,
          cinemaName: cinema.name,
          roomName: `Phòng ${room}`,
          startTime: time,
          endTime: `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`,
          date,
          price: Math.random() > 0.5 ? 90000 : 75000,
          availableSeats: Math.floor(Math.random() * 50) + 20,
          totalSeats: 120,
        })
      })
    }
  })

  return showtimes.sort((a, b) => a.startTime.localeCompare(b.startTime))
}
