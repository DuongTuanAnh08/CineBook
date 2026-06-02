package com.cinebook.backend.modules.dashboard.service;

import com.cinebook.backend.modules.bookings.entity.Booking;
import com.cinebook.backend.modules.bookings.entity.BookingStatus;
import com.cinebook.backend.modules.bookings.repository.BookingRepository;
import com.cinebook.backend.modules.dashboard.dto.ChartResponse;
import com.cinebook.backend.modules.dashboard.dto.KpiResponse;
import com.cinebook.backend.modules.reviews.repository.ReviewRepository;
import com.cinebook.backend.modules.reviews.entity.ReviewStatus;
import com.cinebook.backend.modules.dashboard.dto.MovieRankingResponse;
import com.cinebook.backend.modules.users.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public KpiResponse getKpiSummary() {
        List<BookingStatus> validStatuses = Arrays.asList(BookingStatus.Confirmed, BookingStatus.CheckedIn);
        Integer totalRevenue = bookingRepository.sumTotalAfterTaxByStatusIn(validStatuses);
        Integer totalTickets = bookingRepository.sumTotalTicketsAmountByStatusIn(validStatuses);
        
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(23, 59, 59);
        
        Long newUsers = userRepository.countByCreatedAtBetween(startOfMonth, endOfMonth);

        return KpiResponse.builder()
                .totalRevenue(totalRevenue)
                .totalTickets(totalTickets)
                .newUsers(newUsers)
                .build();
    }

    public List<ChartResponse> getRevenueChart() {
        List<BookingStatus> validStatuses = Arrays.asList(BookingStatus.Confirmed, BookingStatus.CheckedIn);
        int currentYear = LocalDate.now().getYear();
        LocalDateTime startOfYear = LocalDateTime.of(currentYear, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(currentYear, 12, 31, 23, 59, 59);

        List<Booking> bookings = bookingRepository.findByStatusInAndCreatedAtBetween(validStatuses, startOfYear, endOfYear);

        Map<String, Integer> revenueByMonth = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            revenueByMonth.put("Month " + i, 0);
        }

        for (Booking booking : bookings) {
            String monthLabel = "Month " + booking.getCreatedAt().getMonthValue();
            revenueByMonth.put(monthLabel, revenueByMonth.get(monthLabel) + booking.getTotalAfterTax());
        }

        List<ChartResponse> result = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            String label = "Month " + i;
            result.add(new ChartResponse(label, revenueByMonth.get(label)));
        }

        return result;
    }

    public byte[] exportRevenueToExcel() throws IOException {
        List<BookingStatus> validStatuses = Arrays.asList(BookingStatus.Confirmed, BookingStatus.CheckedIn);
        List<Booking> bookings = bookingRepository.findByStatusInOrderByCreatedAtDesc(validStatuses);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Revenue Report");

            // Header Row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Booking ID");
            headerRow.createCell(1).setCellValue("Showtime ID");
            headerRow.createCell(2).setCellValue("Total After Tax");
            headerRow.createCell(3).setCellValue("Created At");

            int rowIdx = 1;
            for (Booking booking : bookings) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(booking.getId() != null ? booking.getId().toString() : "");
                row.createCell(1).setCellValue(booking.getShowtime() != null && booking.getShowtime().getShowtimeId() != null ? booking.getShowtime().getShowtimeId().toString() : "");
                row.createCell(2).setCellValue(booking.getTotalAfterTax() != null ? booking.getTotalAfterTax() : 0);
                row.createCell(3).setCellValue(booking.getCreatedAt() != null ? booking.getCreatedAt().toString() : "");
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public List<MovieRankingResponse> getTopMoviesByRevenue() {
        List<BookingStatus> validStatuses = Arrays.asList(BookingStatus.Confirmed, BookingStatus.CheckedIn);
        Pageable topFive = PageRequest.of(0, 5);
        List<Object[]> results = bookingRepository.findTopMoviesByRevenue(validStatuses, topFive);
        return results.stream().map(row -> new MovieRankingResponse(
                ((Number) row[0]).longValue(),
                (String) row[1],
                new BigDecimal(((Number) row[2]).toString())
        )).collect(Collectors.toList());
    }

    public List<MovieRankingResponse> getTopMoviesByRating() {
        Pageable topFive = PageRequest.of(0, 5);
        List<Object[]> results = reviewRepository.findTopMoviesByRating(ReviewStatus.Active, topFive);
        return results.stream().map(row -> new MovieRankingResponse(
                ((Number) row[0]).longValue(),
                (String) row[1],
                new BigDecimal(((Number) row[2]).toString())
        )).collect(Collectors.toList());
    }
}
