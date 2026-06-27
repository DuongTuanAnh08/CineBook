import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { format, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Play,
  Star,
  User,
  Film,
  Ticket,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { StarRating } from '@/components/movies/star-rating'
import { ShowtimeList } from '@/components/movies/showtime-list'
import { useData } from '@/contexts/data-context'
import { useEffect } from 'react'
import reviewApi from '@/api/reviewApi'
import { MessageSquare, Send } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import bookingApi from '@/api/bookingApi'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const value = String(url).trim();
  const idMatch = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  const videoId = idMatch?.[1] || (!value.includes('/') ? value : '');
  return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
}
const dummyMovies = [
  {
    id: "m-1",
    movieId: "m-1",
    title: "Minions: Sự Trỗi Dậy Của Gru",
    originalTitle: "Minions: The Rise of Gru",
    poster: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=1200&auto=format&fit=crop&q=80",
    ageRating: "P",
    duration: 88,
    rating: 4.8,
    releaseDate: "2026-06-01",
    genres: ["Hoạt hình", "Hài hước", "Gia đình"],
    status: "now_showing",
    director: "Kyle Balda",
    synopsis: "Hành trình trở thành siêu ác nhân vĩ đại nhất thế giới của cậu bé Gru 12 tuổi cùng sự trợ giúp đắc lực của các sinh vật màu vàng siêu quậy.",
    description: "Hành trình trở thành siêu ác nhân vĩ đại nhất thế giới của cậu bé Gru 12 tuổi cùng sự trợ giúp đắc lực của các sinh vật màu vàng siêu quậy.",
    cast: [
      { id: "a-1", name: "Steve Carell", role: "Gru (Voice)", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
      { id: "a-2", name: "Pierre Coffin", role: "Minions (Voice)", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop" },
      { id: "a-3", name: "Alan Arkin", role: "Wild Knuckles (Voice)", avatar: "https://images.unsplash.com/photo-1527983359383-4758693f760c?w=100&h=100&fit=crop" }
    ],
    trailer: "https://www.youtube.com/watch?v=6DxjJzmReXo"
  },
  {
    id: "m-2",
    movieId: "m-2",
    title: "Spider-Man: Không Còn Đường Về",
    originalTitle: "Spider-Man: No Way Home",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&auto=format&fit=crop&q=80",
    ageRating: "C13",
    duration: 148,
    rating: 4.9,
    releaseDate: "2026-06-15",
    genres: ["Hành động", "Phiêu lưu", "Sci-Fi"],
    status: "now_showing",
    director: "Jon Watts",
    synopsis: "Lần đầu tiên trong lịch sử điện ảnh của Người Nhện, danh tính người hùng hàng xóm thân thiện bị vạch trần, buộc anh phải tìm đến Doctor Strange để giải quyết rắc rối.",
    description: "Lần đầu tiên trong lịch sử điện ảnh của Người Nhện, danh tính người hùng hàng xóm thân thiện bị vạch trần, buộc anh phải tìm đến Doctor Strange để giải quyết rắc rối.",
    cast: [
      { id: "a-4", name: "Tom Holland", role: "Peter Parker / Spider-Man", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
      { id: "a-5", name: "Zendaya", role: "MJ", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      { id: "a-6", name: "Benedict Cumberbatch", role: "Doctor Strange", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
    ],
    trailer: "https://www.youtube.com/watch?v=JfVOs4VSpmA"
  },
  {
    id: "m-3",
    movieId: "m-3",
    title: "Người Dơi: Kỵ Sĩ Bóng Đêm",
    originalTitle: "The Dark Knight",
    poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1200&auto=format&fit=crop&q=80",
    ageRating: "C16",
    duration: 152,
    rating: 4.9,
    releaseDate: "2026-06-10",
    genres: ["Hành động", "Tội phạm", "Tâm lý"],
    status: "now_showing",
    director: "Christopher Nolan",
    synopsis: "Khi mối đe dọa được gọi là Joker phá hoại và gây ra hỗn loạn cho người dân Gotham, Batman phải đối mặt với thử thách tâm lý lớn nhất để chống lại tội ác.",
    description: "Khi mối đe dọa được gọi là Joker phá hoại và gây ra hỗn loạn cho người dân Gotham, Batman phải đối mặt với thử thách tâm lý lớn nhất để chống lại tội ác.",
    cast: [
      { id: "a-7", name: "Christian Bale", role: "Bruce Wayne / Batman", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { id: "a-8", name: "Heath Ledger", role: "Joker", avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&h=100&fit=crop" }
    ],
    trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
  },
  {
    id: "m-4",
    movieId: "m-4",
    title: "Inside Out 2: Những Mảnh Ghép Cảm Xúc 2",
    originalTitle: "Inside Out 2",
    poster: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=1200&auto=format&fit=crop&q=80",
    ageRating: "P",
    duration: 96,
    rating: 4.7,
    releaseDate: "2026-06-25",
    genres: ["Hoạt hình", "Hài hước", "Tâm lý"],
    status: "now_showing",
    director: "Kelsey Mann",
    synopsis: "Quay trở lại tâm trí của cô bé Riley lúc này đã là một thiếu niên, trung tâm điều khiển cảm xúc đột ngột trải qua một đợt cải tạo để nhường chỗ cho những Cảm xúc Mới!",
    description: "Quay trở lại tâm trí của cô bé Riley lúc này đã là một thiếu niên, trung tâm điều khiển có sự xuất hiện của lo âu, xấu hổ, ghen tị và các cảm xúc mới của tuổi dậy thì.",
    cast: [
      { id: "a-9", name: "Amy Poehler", role: "Joy (Voice)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
      { id: "a-10", name: "Maya Hawke", role: "Anxiety (Voice)", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" }
    ],
    trailer: "https://www.youtube.com/watch?v=LEjhY15eCx0"
  },
  {
    id: "m-5",
    movieId: "m-5",
    title: "Avatar: Dòng Chảy Của Nước",
    originalTitle: "Avatar: The Way of Water",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    ageRating: "C13",
    duration: 192,
    rating: 4.8,
    releaseDate: "2026-06-05",
    genres: ["Hành động", "Phiêu lưu", "Sci-Fi"],
    status: "now_showing",
    director: "James Cameron",
    synopsis: "Jake Sully sống cùng gia đình mới thành lập trên hành tinh Pandora. Khi một mối đe dọa quen thuộc quay trở lại để hoàn thành những gì họ đã bắt đầu, Jake phải hợp tác với Neytiri và quân đội của bộ tộc Na'vi để bảo vệ hành tinh của họ.",
    description: "Jake Sully sống cùng gia đình mới thành lập trên hành tinh Pandora. Khi một mối đe dọa quen thuộc quay trở lại để hoàn thành những gì họ đã bắt đầu, Jake phải hợp tác với Neytiri và quân đội của bộ tộc Na'vi để bảo vệ hành tinh của họ.",
    cast: [
      { id: "a-11", name: "Sam Worthington", role: "Jake Sully", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { id: "a-12", name: "Zoe Saldana", role: "Neytiri", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
    ],
    trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0"
  },
  {
    id: "m-6",
    movieId: "m-6",
    title: "Dune: Hành Tinh Cát - Phần 2",
    originalTitle: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=1200&auto=format&fit=crop&q=80",
    ageRating: "C13",
    duration: 166,
    rating: 4.9,
    releaseDate: "2026-07-20",
    genres: ["Sci-Fi", "Phiêu lưu", "Hành động"],
    status: "coming_soon",
    director: "Denis Villeneuve",
    synopsis: "Paul Atreides gia nhập cùng Chani và người Fremen khi đi trên con đường trả thù những kẻ âm mưu tiêu diệt gia đình mình.",
    description: "Paul Atreides gia nhập cùng Chani và người Fremen khi đi trên con đường trả thù những kẻ âm mưu tiêu diệt gia đình mình.",
    cast: [
      { id: "a-13", name: "Timothée Chalamet", role: "Paul Atreides", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
      { id: "a-14", name: "Zendaya", role: "Chani", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
    ],
    trailer: "https://www.youtube.com/watch?v=U2Qp5pL3C-Y"
  },
  {
    id: "m-7",
    movieId: "m-7",
    title: "Evil Dead Rise: Quỷ Dữ Thức Tỉnh",
    originalTitle: "Evil Dead Rise",
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&auto=format&fit=crop&q=80",
    ageRating: "C18",
    duration: 97,
    rating: 4.5,
    releaseDate: "2026-07-30",
    genres: ["Kinh dị", "Bí ẩn"],
    status: "coming_soon",
    director: "Lee Cronin",
    synopsis: "Một câu chuyện rùng rợn về hai chị em bị ghẻ lạnh có cuộc hội ngộ bị cắt ngắn bởi sự trỗi dậy của những con quỷ sở hữu xác thịt.",
    description: "Một câu chuyện rùng rợn về hai chị em bị ghẻ lạnh có cuộc hội ngộ bị cắt ngắn bởi sự trỗi dậy của những con quỷ sở hữu xác thịt.",
    cast: [
      { id: "a-15", name: "Lily Sullivan", role: "Beth", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
      { id: "a-16", name: "Alyssa Sutherland", role: "Ellie", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" }
    ],
    trailer: "https://www.youtube.com/watch?v=BqQNO7Bz-aE"
  }
];

export default function MovieDetailPage() {
  const navigate = useNavigate();
  const { movies, showtimes } = useData();
  const { user } = useAuth();
  const { id } = useParams()

  const activeMovies = movies.length > 0 ? movies : dummyMovies
  const movie = activeMovies.find((m) => String(m.id) === String(id) || String(m.movieId) === String(id))
  const trailerEmbedUrl = getYouTubeEmbedUrl(movie?.trailer)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [reviews, setReviews] = useState([]);
  
  const [hasWatched, setHasWatched] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (movie && (movie.id || movie.movieId)) {
      const fetchReviews = async () => {
        try {
          const res = await reviewApi.getMovieReviews(movie.movieId || movie.id);
          if (res.success) {
            setReviews(res.data || []);
          }
        } catch (error) {
          console.error('Failed to fetch reviews', error);
        }
      };
      fetchReviews();

      if (user) {
        const checkWatched = async () => {
          try {
            const res = await bookingApi.getMyTickets();
            if (res.success && res.data) {
              const watchedTicket = res.data.find(t => 
                String(t.movieId) === String(movie.movieId || movie.id) && 
                (t.status === 'Paid' || t.status === 'Completed' || t.status === 'paid' || t.status === 'completed')
              );
              if (watchedTicket) {
                setHasWatched(true);
                const rawBookingId = typeof watchedTicket.id === 'string' && watchedTicket.id.startsWith('BK') 
                  ? parseInt(watchedTicket.id.replace('BK', ''), 10) 
                  : watchedTicket.id;
                setBookingId(Number(rawBookingId));
              }
            }
          } catch (error) {
            console.error('Failed to check watched status', error);
          }
        };
        checkWatched();
      }
    }
  }, [movie, user]);

  const handleSubmitReview = async () => {
    if (myRating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    if (!myComment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await reviewApi.createReview({
        customerId: user.id,
        movieId: movie.movieId || movie.id,
        bookingId: bookingId,
        rating: myRating,
        comment: myComment
      });

      if (res.success) {
        toast.success('Gửi đánh giá thành công!');
        setMyRating(0);
        setMyComment("");
        // Refresh reviews
        const refreshRes = await reviewApi.getMovieReviews(movie.movieId || movie.id);
        if (refreshRes.success) setReviews(refreshRes.data || []);
      } else {
        toast.error(res.error?.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const movieShowtimes = useMemo(() => {
    if (!movie || movie.status !== 'now_showing') return [];
    return showtimes.filter(s => String(s.movieId) === String(movie.movieId || movie.id));
  }, [id, movie, showtimes]);

  const activeShowtimes = useMemo(() => {
    return movieShowtimes;
  }, [movieShowtimes]);

  const availableCinemas = useMemo(() => {
    const map = new Map();
    activeShowtimes.forEach(s => {
      map.set(s.cinemaId, s.cinemaName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [activeShowtimes]);

  const dates = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      result.push({
        value: format(date, 'yyyy-MM-dd'),
        label: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : format(date, 'EEEE', {
          locale: vi
        }),
        date: format(date, 'dd/MM')
      });
    }
    return result;
  }, []);

  const [selectedCinemaId, setSelectedCinemaId] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedShowtimeId, setSelectedShowtimeId] = useState('');

  useEffect(() => {
    if (availableCinemas.length > 0 && !selectedCinemaId) {
      setSelectedCinemaId(availableCinemas[0].id);
    }
  }, [availableCinemas, selectedCinemaId]);

  const filteredShowtimesForCinemaAndDate = useMemo(() => {
    return activeShowtimes.filter(s => 
      s.date === selectedDate && 
      (!selectedCinemaId || String(s.cinemaId) === String(selectedCinemaId))
    );
  }, [activeShowtimes, selectedDate, selectedCinemaId]);

  const selectedShowtime = useMemo(() => {
    return activeShowtimes.find(s => s.id === selectedShowtimeId);
  }, [activeShowtimes, selectedShowtimeId]);

  const handleBookTickets = () => {
    if (!selectedShowtimeId || !movie) return;
    const s = activeShowtimes.find(st => st.id === selectedShowtimeId);
    if (!s) return;
    navigate(`/booking/${movie.id}?id=${movie.id}&cinema=${s.cinemaId}&room=${encodeURIComponent(s.roomName)}&date=${s.date}&time=${s.startTime}&showtimeId=${s.id}`);
  };

  const handleWriteReviewClick = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để viết đánh giá!');
      return;
    }
    if (!hasWatched) {
      toast.error('Bạn cần mua vé xem phim này trước để đánh giá!');
      return;
    }
    if (reviews.some(r => String(r.customerId) === String(user?.id))) {
      toast.error('Bạn đã viết đánh giá cho phim này rồi!');
      return;
    }
    document.getElementById('write-review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return movie?.rating || 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews, movie]);

  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!reviews || reviews.length === 0) {
      return {
        5: 62,
        4: 24,
        3: 9,
        2: 3,
        1: 2,
        total: 2847,
        average: movie?.rating || 4.5
      };
    }
    reviews.forEach(r => {
      const rate = Math.round(r.rating || 5);
      if (counts[rate] !== undefined) counts[rate]++;
    });
    const total = reviews.length;
    return {
      5: Math.round((counts[5] / total) * 100) || 0,
      4: Math.round((counts[4] / total) * 100) || 0,
      3: Math.round((counts[3] / total) * 100) || 0,
      2: Math.round((counts[2] / total) * 100) || 0,
      1: Math.round((counts[1] / total) * 100) || 0,
      total,
      average: currentRating
    };
  }, [reviews, movie, currentRating]);

  if (!movie) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
        <Film className="mb-4 size-16 text-muted-foreground/50" />
        <h1 className="text-2xl font-bold">Không tìm thấy phim</h1>
        <p className="mt-2 text-muted-foreground">
          Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild className="mt-6">
          <Link to="/movies">
            <ArrowLeft className="mr-2 size-4" />
            Quay lại danh sách phim
          </Link>
        </Button>
      </div>
    )
  }

  const ageRatingColors = {
    P: 'bg-green-600',
    C13: 'bg-yellow-600',
    C16: 'bg-orange-600',
    C18: 'bg-red-650',
  }

  const ageRatingDescriptions = {
    P: 'Phù hợp mọi lứa tuổi',
    C13: 'Cấm khán giả dưới 13 tuổi',
    C16: 'Cấm khán giả dưới 16 tuổi',
    C18: 'Cấm khán giả dưới 18 tuổi',
  }

  return (
    <>
      {/* ── 1. Hero Banner Section ── */}
      <div className="relative overflow-hidden min-h-[500px] flex items-center bg-zinc-950">
        {movie.backdrop && (
          <div className="absolute inset-0">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="absolute right-0 top-0 h-full w-full lg:w-3/5 object-cover object-center opacity-50"
            />
            {/* Soft gradient covers to blend the image into the black background */}
            <div className="absolute inset-0 bg-gradient-to-r from-background from-30% via-background/85 lg:via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/20" />
          </div>
        )}

        <div className="container relative z-10 max-w-[1400px] mx-auto px-4 pt-28 pb-16">
          {/* Back Button */}
          <Link 
            to="/movies" 
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Quay lại danh sách
          </Link>

          {/* Movie Metadata Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="w-[200px] md:w-[240px] shrink-0 rounded-2xl overflow-hidden aspect-[2/3] border border-white/10 shadow-2xl relative bg-zinc-900 group">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
              {/* Play icon badge representing preview availability */}
              {trailerEmbedUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Play className="w-12 h-12 text-primary fill-current" />
                </div>
              )}
            </div>

            {/* Info details */}
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(g => (
                  <Badge key={g} variant="secondary" className="bg-white/10 hover:bg-white/15 text-zinc-300 border-0 text-xs font-semibold px-2.5 py-0.5">
                    {g}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>
              {movie.originalTitle && (
                <p className="text-lg text-zinc-400 font-medium -mt-2">
                  {movie.originalTitle}
                </p>
              )}

              {/* Age badge + Clock duration + Release date + Star rating */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-300 pt-1">
                <div className="flex items-center gap-2">
                  <Badge className={`text-white border-0 font-bold px-2 py-0.5 text-xs rounded-md ${ageRatingColors[movie.ageRating] || 'bg-gray-600'}`}>
                    {movie.ageRating}
                  </Badge>
                  <span className="text-xs text-zinc-400">
                    {ageRatingDescriptions[movie.ageRating]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span>{movie.duration} phút</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span>
                    {format(new Date(movie.releaseDate), 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <Star className="w-4 h-4 fill-current text-primary" />
                  <span className="font-extrabold text-white">{currentRating.toFixed(1)}/5</span>
                  <span className="text-xs text-zinc-400">({reviews.length} đánh giá)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Official Trailer Section ── */}
      {trailerEmbedUrl && (
        <section className="py-12 border-t border-white/5 bg-background">
          <div className="container max-w-[1000px] mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">Trailer chính thức</h2>
              <p className="text-xs text-zinc-400 mt-1">Xem trước giới thiệu phim đặc sắc</p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-zinc-950 shadow-2xl">
              <iframe
                src={trailerEmbedUrl}
                title={`Trailer: ${movie.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Split Main Grid: Info vs. Booking Widget ── */}
      <section className="py-16 bg-[#09090b] border-t border-white/5">
        <div className="container max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Synopsis & Cast (2/3 width) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Synopsis */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white tracking-tight border-l-4 border-primary pl-3">Nội dung phim</h2>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {movie.description || movie.synopsis}
              </p>
              <div className="pt-2 flex items-center gap-2 text-sm">
                <span className="text-zinc-400">Đạo diễn:</span>
                <span className="font-bold text-white hover:text-primary transition-colors cursor-pointer">{movie.director}</span>
              </div>
            </div>

            {/* Top Cast */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white tracking-tight border-l-4 border-primary pl-3">Diễn viên chính</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(movie.cast || []).map((actor) => (
                  <div 
                    key={actor.id} 
                    className="flex flex-col items-center p-4 rounded-2xl border border-white/5 bg-card/45 hover:border-primary/20 hover:bg-card/75 transition-all text-center group"
                  >
                    <Avatar className="mb-3 size-20 border border-white/10 ring-2 ring-primary/10 transition-transform group-hover:scale-105">
                      <AvatarImage src={actor.avatar} alt={actor.name} />
                      <AvatarFallback className="bg-zinc-800 text-white font-black text-lg">
                        {actor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-white text-sm line-clamp-1 leading-tight">{actor.name}</h4>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{actor.role}</p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Right Column: Book Your Seats Widget (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-[#121215] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6 sticky top-28">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Ticket className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black text-white tracking-tight">Mua vé xem phim</h3>
              </div>
              
              {/* Step 1: Chọn Rạp */}
              {availableCinemas.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">1. Chọn rạp chiếu</label>
                  <select
                    value={selectedCinemaId}
                    onChange={(e) => {
                      setSelectedCinemaId(e.target.value);
                      setSelectedShowtimeId('');
                    }}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-primary text-white rounded-xl px-3 py-2.5 h-11 text-sm focus:outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%23a1a1aa%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                  >
                    {availableCinemas.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#121212] text-white">{c.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-xs text-amber-500 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                  Phim chưa được xếp lịch chiếu. Vui lòng quay lại sau!
                </div>
              )}

              {/* Step 2: Chọn Ngày */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">2. Chọn ngày chiếu</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide -mx-2 px-2">
                  {dates.map(date => {
                    const isSelected = selectedDate === date.value;
                    return (
                      <button
                        key={date.value}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date.value);
                          setSelectedShowtimeId('');
                        }}
                        className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl px-3.5 py-2 text-center transition-all ${isSelected ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 scale-105' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                      >
                        <span className="text-[9px] font-normal capitalize tracking-wider">{date.label}</span>
                        <span className="text-xs font-bold mt-0.5">{date.date}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Chọn Suất Chiếu */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between block">
                  <span>3. Chọn Suất Chiếu</span>
                  {selectedShowtime && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/5">
                      {selectedShowtime.roomName}
                    </Badge>
                  )}
                </label>
                
                {filteredShowtimesForCinemaAndDate.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {filteredShowtimesForCinemaAndDate.map(showtime => {
                      const isSelected = selectedShowtimeId === showtime.id;
                      const now = new Date();
                      const [hours, minutes] = showtime.startTime.split(':');
                      const [year, month, day] = showtime.date.split('-');
                      const showtimeDate = new Date(year, month - 1, day, hours, minutes);
                      const isPast = showtimeDate < now;

                      return (
                        <button
                          key={showtime.id}
                          type="button"
                          disabled={isPast || showtime.availableSeats === 0}
                          onClick={() => setSelectedShowtimeId(showtime.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${isPast || showtime.availableSeats === 0 ? 'opacity-30 cursor-not-allowed border-white/5 bg-black/10' : isSelected ? 'border-primary bg-primary/10 text-primary scale-105 shadow-sm font-black' : 'border-white/5 bg-white/5 hover:border-white/20 text-white'}`}
                        >
                          <span className="text-sm font-bold">{showtime.startTime}</span>
                          <span className="text-[9px] text-zinc-400 mt-1">{showtime.availableSeats} ghế trống</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-6 bg-white/5 rounded-xl border border-white/5">
                    Không có suất chiếu vào ngày này
                  </div>
                )}
              </div>

              {/* Step 4: Giá Vé & Nút Mua Vé */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Giá vé từ:</span>
                  <span className="text-2xl font-black text-primary">
                    {selectedShowtime 
                      ? `${new Intl.NumberFormat('vi-VN').format(selectedShowtime.price)} đ` 
                      : (filteredShowtimesForCinemaAndDate[0] 
                         ? `${new Intl.NumberFormat('vi-VN').format(filteredShowtimesForCinemaAndDate[0].price)} đ` 
                         : '--- đ')}
                  </span>
                </div>
                
                <Button
                  disabled={!selectedShowtimeId}
                  onClick={handleBookTickets}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Ticket className="w-5 h-5 fill-current" />
                  Đặt vé ngay
                </Button>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── 4. Audience Reviews Section ── */}
      <section className="py-16 bg-background border-t border-white/5">
        <div className="container max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight border-l-4 border-primary pl-3">Đánh giá từ khán giả</h2>
            <Button
              variant="outline"
              onClick={handleWriteReviewClick}
              className="border-primary/45 hover:border-primary text-primary hover:text-primary-foreground hover:bg-primary/10 rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Viết đánh giá
            </Button>
          </div>

          {/* Rating breakdown block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card/35 border border-white/5 rounded-2xl p-6 md:p-8 items-center mb-8">
            <div className="text-center md:border-r md:border-white/5 space-y-2">
              <div className="text-5xl font-black text-white">{ratingBreakdown.average.toFixed(1)}</div>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(ratingBreakdown.average) ? 'fill-primary text-primary' : 'text-zinc-700 fill-zinc-700'}`} />
                ))}
              </div>
              <div className="text-xs text-zinc-400">Dựa trên {ratingBreakdown.total} đánh giá</div>
            </div>
            
            <div className="md:col-span-2 space-y-2.5">
              {[5, 4, 3, 2, 1].map(stars => (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-zinc-400 text-right">{stars}</span>
                  <Star className="w-3 h-3 fill-zinc-400 text-zinc-400" />
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${ratingBreakdown[stars]}%` }} />
                  </div>
                  <span className="w-8 text-zinc-400 text-right">{ratingBreakdown[stars]}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Panel inline */}
          {hasWatched && !reviews.some(r => String(r.customerId) === String(user?.id)) && (
            <div id="write-review-form" className="mb-8 bg-card/35 border border-white/5 rounded-2xl p-6">
              <h3 className="mb-4 text-base font-bold text-white">Viết nhận xét của bạn</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">Đánh giá của bạn:</span>
                  <div className="flex gap-1 cursor-pointer">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        onClick={() => setMyRating(i + 1)}
                        className={`w-5 h-5 transition-colors ${i < myRating ? 'fill-primary text-primary' : 'text-zinc-600 hover:text-primary/70'}`}
                      />
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  className="min-h-[100px] bg-white/5 border border-white/10 hover:border-white/15 focus:border-primary text-white rounded-xl"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitReview} 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-10 px-5 rounded-xl flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center text-zinc-500 py-8 bg-white/5 rounded-2xl border border-white/5">
              Chưa có đánh giá nào cho phim này.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-5 rounded-2xl border border-white/5 bg-card/25 flex gap-4">
                  <Avatar className="size-10 ring-2 ring-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{review.customerName}</h4>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-primary text-primary' : 'text-zinc-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Related Movies Section ── */}
      <div className="border-t border-white/5 bg-card/10 py-16">
        <div className="container max-w-[1400px] mx-auto px-4">
          <h2 className="mb-8 text-2xl font-black text-white tracking-tight border-l-4 border-primary pl-3">Phim tương tự</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {activeMovies
              .filter(
                (m) =>
                  m.id !== movie.id &&
                  (m.genres || []).some((g) => (movie.genres || []).includes(g))
              )
              .slice(0, 6)
              .map((relatedMovie) => (
                <Link
                  key={relatedMovie.id}
                  to={`/movies/${relatedMovie.id}`}
                  className="group block space-y-3"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 bg-card hover:border-primary/20 transition-all shadow-lg">
                    <img
                      src={relatedMovie.poster}
                      alt={relatedMovie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-3">
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg text-xs h-8">
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-primary leading-tight">
                      {relatedMovie.title}
                    </h4>
                    <div className="mt-1.5 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span className="text-xs text-zinc-400 font-semibold">
                        {(relatedMovie.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
