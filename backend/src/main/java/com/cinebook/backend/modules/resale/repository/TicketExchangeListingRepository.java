package com.cinebook.backend.modules.resale.repository;

import com.cinebook.backend.modules.resale.entity.TicketExchangeListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

@Repository
public interface TicketExchangeListingRepository extends JpaRepository<TicketExchangeListing, Long> {
    
    @Modifying
    @Query(value = "UPDATE TicketExchangeListings r " +
                   "JOIN Bookings b ON r.booking_id = b.booking_id " +
                   "JOIN Showtimes s ON b.showtime_id = s.showtime_id " +
                   "SET r.status = 'HIDDEN', r.hidden_reason = 'Hệ thống tự động ẩn vì suất chiếu đã diễn ra' " +
                   "WHERE r.status = 'ACTIVE' AND s.start_time <= :now", nativeQuery = true)
    int updateStatusForExpiredShowtimes(@Param("now") LocalDateTime now);
}
