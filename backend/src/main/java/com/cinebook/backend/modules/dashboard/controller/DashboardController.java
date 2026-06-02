package com.cinebook.backend.modules.dashboard.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.dashboard.dto.ChartResponse;
import com.cinebook.backend.modules.dashboard.dto.KpiResponse;
import com.cinebook.backend.modules.dashboard.dto.MovieRankingResponse;
import com.cinebook.backend.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/kpi")
    public ApiResponse<KpiResponse> getKpiSummary() {
        return ApiResponse.ok(dashboardService.getKpiSummary());
    }

    @GetMapping("/chart/revenue")
    public ApiResponse<List<ChartResponse>> getRevenueChart() {
        return ApiResponse.ok(dashboardService.getRevenueChart());
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportRevenueToExcel() {
        try {
            byte[] excelContent = dashboardService.exportRevenueToExcel();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"revenue_report.xlsx\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelContent);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/movies/top-revenue")
    public ApiResponse<List<MovieRankingResponse>> getTopMoviesByRevenue() {
        return ApiResponse.ok(dashboardService.getTopMoviesByRevenue());
    }

    @GetMapping("/movies/top-rating")
    public ApiResponse<List<MovieRankingResponse>> getTopMoviesByRating() {
        return ApiResponse.ok(dashboardService.getTopMoviesByRating());
    }
}
