package com.cinebook.backend.modules.reviews.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.reviews.dto.ReviewDto;
import com.cinebook.backend.modules.reviews.dto.ReviewRequest;
import com.cinebook.backend.modules.reviews.entity.Review;
import com.cinebook.backend.modules.reviews.entity.ReviewStatus;
import com.cinebook.backend.modules.reviews.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @PostMapping
    @PreAuthorize("hasRole('Customer')")
    public ApiResponse<Review> create(@RequestBody ReviewRequest request) {
        try {
            Review review = service.createReview(
                    request.getCustomerId(),
                    request.getMovieId(),
                    request.getBookingId(),
                    request.getRating(),
                    request.getComment()
            );
            return ApiResponse.ok(review);
        } catch (Exception e) {
            return ApiResponse.error("BAD_REQUEST", e.getMessage());
        }
    }

    @GetMapping("/movie/{movieId}")
    public ApiResponse<List<ReviewDto>> getMovieReviews(@PathVariable Long movieId) {
        return ApiResponse.ok(service.getReviewsByMovieId(movieId));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('SystemAdmin', 'ScheduleManager')")
    public ApiResponse<Page<ReviewDto>> getAllReviewsAdmin(Pageable pageable) {
        return ApiResponse.ok(service.getAllReviewsAdmin(pageable));
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('SystemAdmin')")
    public ApiResponse<ReviewDto> updateReviewStatus(
            @PathVariable Long id,
            @RequestParam ReviewStatus status) {
        return ApiResponse.ok(service.updateReviewStatus(id, status));
    }
}
