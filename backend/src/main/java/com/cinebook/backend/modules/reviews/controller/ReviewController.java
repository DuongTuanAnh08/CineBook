package com.cinebook.backend.modules.reviews.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.reviews.dto.ReviewRequest;
import com.cinebook.backend.modules.reviews.entity.Review;
import com.cinebook.backend.modules.reviews.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @PostMapping
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
}
