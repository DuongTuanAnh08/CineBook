package com.cinebook.backend.modules.bookings.service;

import com.cinebook.backend.modules.bookings.entity.Booking;
import com.cinebook.backend.modules.bookings.entity.BookingSeat;
import com.cinebook.backend.modules.bookings.entity.BookingStatus;
import com.cinebook.backend.modules.bookings.repository.BookingRepository;
import com.cinebook.backend.modules.bookings.repository.BookingSeatRepository;
import com.cinebook.backend.modules.config.service.SystemConfigService;
import com.cinebook.backend.modules.rooms.entity.Room;
import com.cinebook.backend.modules.rooms.entity.Seat;
import com.cinebook.backend.modules.rooms.entity.SeatType;
import com.cinebook.backend.modules.rooms.repository.SeatRepository;
import com.cinebook.backend.modules.showtimes.entity.Showtime;
import com.cinebook.backend.modules.showtimes.repository.ShowtimeRepository;
import com.cinebook.backend.modules.users.User;
import com.cinebook.backend.modules.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final UserRepository userRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final SystemConfigService systemConfigService;

    @Transactional
    public Booking createBooking(Long customerId, Long showtimeId, List<Long> seatIds) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
                
        Room room = showtime.getRoom();

        BigDecimal vipMultiplier = systemConfigService.getSeatVipMultiplier();
        BigDecimal coupleMultiplier = systemConfigService.getSeatCoupleMultiplier();
        BigDecimal vatRate = systemConfigService.getVatRate();
        int holdMinutes = systemConfigService.getSeatHoldMinutes();

        int totalBeforeTax = 0;
        List<BookingSeat> bookingSeats = new ArrayList<>();

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setShowtime(showtime);
        booking.setStatus(BookingStatus.Pending);
        booking.setHoldExpiresAt(LocalDateTime.now().plusMinutes(holdMinutes));
        booking.setVatRateSnapshot(vatRate);

        // Save early to get ID for booking seats
        booking = bookingRepository.save(booking);

        for (Long seatId : seatIds) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found: " + seatId));
            
            BigDecimal multiplier = BigDecimal.ONE;
            if (seat.getSeatType() == SeatType.VIP) {
                multiplier = vipMultiplier;
            } else if (seat.getSeatType() == SeatType.Couple) {
                multiplier = coupleMultiplier;
            }
            
            int basePrice = room.getBaseNormalPrice();
            int seatPrice = BigDecimal.valueOf(basePrice).multiply(multiplier).intValue();
            totalBeforeTax += seatPrice;

            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(booking);
            bookingSeat.setSeat(seat);
            bookingSeat.setSeatType(seat.getSeatType());
            bookingSeat.setPriceAtBooking(seatPrice);
            bookingSeats.add(bookingSeat);
        }

        bookingSeatRepository.saveAll(bookingSeats);

        int vatAmount = BigDecimal.valueOf(totalBeforeTax).multiply(vatRate).setScale(0, RoundingMode.HALF_UP).intValue();
        int totalAfterTax = totalBeforeTax + vatAmount;

        booking.setTotalTicketsAmount(totalBeforeTax);
        booking.setSubTotal(totalBeforeTax); // Assuming subTotal includes total_fnb_amount which is 0 for now
        booking.setTotalBeforeTax(totalBeforeTax);
        booking.setVatAmount(vatAmount);
        booking.setTotalAfterTax(totalAfterTax);

        return bookingRepository.save(booking);
    }

    public org.springframework.data.domain.Page<com.cinebook.backend.modules.bookings.dto.BookingAdminDto> getAllBookingsAdmin(org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(booking -> {
            List<BookingSeat> seats = bookingSeatRepository.findByBooking_Id(booking.getId());
            String seatNames = seats.stream()
                    .map(s -> s.getSeat().getSeatLabel())
                    .collect(java.util.stream.Collectors.joining(", "));

            String movieTitle = booking.getShowtime().getMovie().getTitle();
            String cinemaName = booking.getShowtime().getRoom().getCinema().getName();
            String roomName = booking.getShowtime().getRoom().getName();
            String showtimeTime = booking.getShowtime().getStartTime().toLocalTime().toString();
            String customerName = booking.getCustomer().getFullName();
            String phone = booking.getCustomer().getPhone();

            return com.cinebook.backend.modules.bookings.dto.BookingAdminDto.builder()
                    .id("BK" + String.format("%03d", booking.getId()))
                    .movie(movieTitle)
                    .customer(customerName)
                    .phone(phone)
                    .cinema(cinemaName)
                    .room(roomName)
                    .showtime(showtimeTime)
                    .seats(seatNames)
                    .amount(booking.getTotalAfterTax())
                    .status(booking.getStatus())
                    .date(booking.getCreatedAt().toLocalDate().toString())
                    .build();
        });
    }

    public com.cinebook.backend.modules.bookings.dto.BookingAdminDto updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        booking = bookingRepository.save(booking);

        List<BookingSeat> seats = bookingSeatRepository.findByBooking_Id(booking.getId());
        String seatNames = seats.stream()
                .map(s -> s.getSeat().getSeatLabel())
                .collect(java.util.stream.Collectors.joining(", "));

        String movieTitle = booking.getShowtime().getMovie().getTitle();
        String cinemaName = booking.getShowtime().getRoom().getCinema().getName();
        String roomName = booking.getShowtime().getRoom().getName();
        String showtimeTime = booking.getShowtime().getStartTime().toLocalTime().toString();
        String customerName = booking.getCustomer().getFullName();
        String phone = booking.getCustomer().getPhone();

        return com.cinebook.backend.modules.bookings.dto.BookingAdminDto.builder()
                .id("BK" + String.format("%03d", booking.getId()))
                .movie(movieTitle)
                .customer(customerName)
                .phone(phone)
                .cinema(cinemaName)
                .room(roomName)
                .showtime(showtimeTime)
                .seats(seatNames)
                .amount(booking.getTotalAfterTax())
                .status(booking.getStatus())
                .date(booking.getCreatedAt().toLocalDate().toString())
                .build();
    }

    public List<com.cinebook.backend.modules.bookings.dto.MyBookingDto> getMyBookings(String email) {
        User customer = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        List<Booking> bookings = bookingRepository.findByCustomer_UserIdOrderByCreatedAtDesc(customer.getUserId());
        return bookings.stream().map(booking -> {
            List<BookingSeat> seats = bookingSeatRepository.findByBooking_Id(booking.getId());
            String seatNames = seats.stream()
                    .map(s -> s.getSeat().getSeatLabel())
                    .collect(java.util.stream.Collectors.joining(", "));

            return (com.cinebook.backend.modules.bookings.dto.MyBookingDto) com.cinebook.backend.modules.bookings.dto.MyBookingDto.builder()
                    .id("BK" + String.format("%03d", booking.getId()))
                    .movieId(booking.getShowtime().getMovie().getMovieId())
                    .movieTitle(booking.getShowtime().getMovie().getTitle())
                    .cinemaName(booking.getShowtime().getRoom().getCinema().getName())
                    .roomName(booking.getShowtime().getRoom().getName())
                    .showDate(booking.getShowtime().getStartTime().toLocalDate().toString())
                    .showTime(booking.getShowtime().getStartTime().toLocalTime().toString())
                    .seatNumber(seatNames)
                    .totalAmount(booking.getTotalAfterTax())
                    .status(booking.getStatus().name().toLowerCase())
                    .checkedIn(booking.getStatus() == BookingStatus.CheckedIn)
                    .build();
        }).collect(java.util.stream.Collectors.toList());
    }
    public com.cinebook.backend.modules.bookings.dto.MyBookingDto getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        List<BookingSeat> seats = bookingSeatRepository.findByBooking_Id(booking.getId());
        String seatNames = seats.stream()
                .map(s -> s.getSeat().getSeatLabel())
                .collect(java.util.stream.Collectors.joining(", "));

        return com.cinebook.backend.modules.bookings.dto.MyBookingDto.builder()
                .id("BK" + String.format("%03d", booking.getId()))
                .movieId(booking.getShowtime().getMovie().getMovieId())
                .movieTitle(booking.getShowtime().getMovie().getTitle())
                .cinemaName(booking.getShowtime().getRoom().getCinema().getName())
                .roomName(booking.getShowtime().getRoom().getName())
                .showDate(booking.getShowtime().getStartTime().toLocalDate().toString())
                .showTime(booking.getShowtime().getStartTime().toLocalTime().toString())
                .seatNumber(seatNames)
                .totalAmount(booking.getTotalAfterTax())
                .status(booking.getStatus().name().toLowerCase())
                .checkedIn(booking.getStatus() == BookingStatus.CheckedIn)
                .build();
    }
}
