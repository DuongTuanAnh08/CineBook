package com.cinebook.backend.modules.showtimes.repository;

import com.cinebook.backend.modules.showtimes.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    @Query("SELECT COUNT(s) > 0 FROM Showtime s WHERE s.room.roomId = :roomId AND s.status = 'Scheduled' AND (s.startTime < :endTime AND s.endTime > :startTime)")
    boolean existsConflictingShowtime(@Param("roomId") Long roomId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
}
