package com.cinebook.backend.modules.bookings.scheduler;

import com.cinebook.backend.modules.bookings.entity.Booking;
import com.cinebook.backend.modules.bookings.entity.BookingStatus;
import com.cinebook.backend.modules.bookings.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingScheduler {

    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expirePendingBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> pendingBookings = bookingRepository.findByStatusAndHoldExpiresAtBefore(BookingStatus.Pending, now);
        
        if (!pendingBookings.isEmpty()) {
            log.info("Found {} pending bookings to expire", pendingBookings.size());
            for (Booking booking : pendingBookings) {
                booking.setStatus(BookingStatus.Expired);
            }
            bookingRepository.saveAll(pendingBookings);
        }
    }
}
