import { createContext, useContext, useState, useEffect } from 'react';
import { movies as initialMovies, cinemas as initialCinemas, concessionItems as initialConcessions, mockResaleListings as initialResaleListings, initialShowtimes, initialNews, initialSettings } from '@/lib/mock-data';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  // Khởi tạo state từ localStorage nếu có, nếu không lấy từ mock-data
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem('cinebook_movies');
    return saved ? JSON.parse(saved) : initialMovies;
  });

  const [cinemas, setCinemas] = useState(() => {
    const saved = localStorage.getItem('cinebook_cinemas');
    return saved ? JSON.parse(saved) : initialCinemas;
  });

  const [concessions, setConcessions] = useState(() => {
    const saved = localStorage.getItem('cinebook_concessions');
    return saved ? JSON.parse(saved) : initialConcessions;
  });

  const [resaleListings, setResaleListings] = useState(() => {
    const saved = localStorage.getItem('cinebook_resale');
    return saved ? JSON.parse(saved) : initialResaleListings;
  });

  const [showtimes, setShowtimes] = useState(() => {
    const saved = localStorage.getItem('cinebook_showtimes');
    return saved ? JSON.parse(saved) : initialShowtimes;
  });

  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('cinebook_news');
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cinebook_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // State cho Bookings (Vé đã mua)
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('cinebook_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Lưu state vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cinebook_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('cinebook_cinemas', JSON.stringify(cinemas));
  }, [cinemas]);

  useEffect(() => {
    localStorage.setItem('cinebook_concessions', JSON.stringify(concessions));
  }, [concessions]);

  useEffect(() => {
    localStorage.setItem('cinebook_resale', JSON.stringify(resaleListings));
  }, [resaleListings]);

  useEffect(() => {
    localStorage.setItem('cinebook_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cinebook_showtimes', JSON.stringify(showtimes));
  }, [showtimes]);

  useEffect(() => {
    localStorage.setItem('cinebook_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('cinebook_settings', JSON.stringify(settings));
  }, [settings]);

  // Các hàm tương tác với Movies
  const addMovie = (newMovie) => {
    setMovies(prev => [...prev, { ...newMovie, id: Date.now().toString() }]);
  };
  const updateMovie = (id, updatedData) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };
  const deleteMovie = (id) => {
    setMovies(prev => prev.filter(m => m.id !== id));
  };

  // Các hàm tương tác với Showtimes (Có kiểm tra xung đột - Conflict check)
  const checkConflict = (newShowtime, excludeId = null) => {
    return showtimes.some(s => {
      if (s.id === excludeId) return false;
      // Trùng rạp, phòng, ngày
      if (s.cinemaId === newShowtime.cinemaId && s.roomName === newShowtime.roomName && s.date === newShowtime.date) {
        const parseTime = (t) => {
          const [h, m] = t.split(':').map(Number);
          return h * 60 + m;
        };
        const nStart = parseTime(newShowtime.startTime);
        const nEnd = parseTime(newShowtime.endTime);
        const sStart = parseTime(s.startTime);
        const sEnd = parseTime(s.endTime);
        
        // Có giao nhau về thời gian không (cộng thêm 15p dọn dẹp)
        return (nStart < sEnd + 15) && (nEnd + 15 > sStart);
      }
      return false;
    });
  };

  const addShowtime = (newShowtime) => {
    if (checkConflict(newShowtime)) {
      throw new Error('Trùng lịch chiếu! Phòng này đã có lịch trong khoảng thời gian đã chọn (bao gồm 15 phút dọn dẹp).');
    }
    const st = { ...newShowtime, id: 'st' + Date.now() };
    setShowtimes(prev => [...prev, st].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return st;
  };

  const updateShowtime = (id, updatedData) => {
    if (checkConflict({ ...showtimes.find(s => s.id === id), ...updatedData }, id)) {
      throw new Error('Trùng lịch chiếu! Phòng này đã có lịch trong khoảng thời gian đã chọn.');
    }
    setShowtimes(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s).sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const deleteShowtime = (id) => {
    // Chỉ xóa được nếu chưa có vé bán ra (Mô phỏng ở đây luôn xóa được)
    setShowtimes(prev => prev.filter(s => s.id !== id));
  };

  // Các hàm tương tác với Bookings
  const createBooking = (bookingData) => {
    const newBooking = {
      id: 'BK' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    setBookings(prev => [newBooking, ...prev]);
    
    // Giảm availableSeats của suất chiếu đó
    setShowtimes(prev => prev.map(s => s.id === bookingData.showtime.id ? { ...s, availableSeats: Math.max(0, s.availableSeats - bookingData.seats.length) } : s));

    return newBooking;
  };

  // Tương tác với Bắp nước
  const addConcession = (item) => {
    setConcessions(prev => [...prev, { ...item, id: 'c' + Date.now() }]);
  };
  const updateConcession = (id, data) => {
    setConcessions(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };
  const deleteConcession = (id) => {
    setConcessions(prev => prev.filter(c => c.id !== id));
  };

  // Tương tác với Chợ vé
  const updateResaleStatus = (id, newStatus) => {
    setResaleListings(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  // Tương tác với Tin tức
  const addNews = (newsData) => {
    const newArticle = { ...newsData, id: 'n' + Date.now().toString(), createdAt: new Date().toISOString() };
    setNews(prev => [newArticle, ...prev]);
  };
  const updateNews = (id, updatedData) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...updatedData } : n));
  };
  const deleteNews = (id) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <DataContext.Provider value={{
      movies, cinemas, concessions, resaleListings, bookings, showtimes, news, settings,
      addMovie, updateMovie, deleteMovie,
      addShowtime, updateShowtime, deleteShowtime,
      createBooking,
      addConcession, updateConcession, deleteConcession,
      updateResaleStatus,
      addNews, updateNews, deleteNews,
      updateSettings
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
