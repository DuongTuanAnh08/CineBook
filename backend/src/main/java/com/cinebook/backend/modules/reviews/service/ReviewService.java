package com.cinebook.backend.modules.reviews.service;

import com.cinebook.backend.modules.reviews.entity.Review;
import com.cinebook.backend.modules.reviews.entity.ReviewStatus;
import com.cinebook.backend.modules.reviews.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository repository;

    public Review createReview(Long customerId, Long movieId, Long bookingId, Integer rating, String comment) {
        Review review = Review.builder()
                .customerId(customerId)
                .movieId(movieId)
                .bookingId(bookingId)
                .rating(rating)
                .comment(comment)
                .status(ReviewStatus.Active)
                .build();
        return repository.save(review);
    }
}
