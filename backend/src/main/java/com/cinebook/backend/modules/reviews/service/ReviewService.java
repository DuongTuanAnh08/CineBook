package com.cinebook.backend.modules.reviews.service;

import com.cinebook.backend.modules.reviews.dto.ReviewDto;
import com.cinebook.backend.modules.reviews.entity.Review;
import com.cinebook.backend.modules.reviews.entity.ReviewStatus;
import com.cinebook.backend.modules.reviews.repository.ReviewRepository;
import com.cinebook.backend.modules.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository repository;
    private final UserRepository userRepository;

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

    public List<ReviewDto> getReviewsByMovieId(Long movieId) {
        List<Review> reviews = repository.findByMovieIdOrderByCreatedAtDesc(movieId);
        return reviews.stream().map(r -> {
            String customerName = userRepository.findById(r.getCustomerId())
                    .map(u -> u.getFullName())
                    .orElse("Khách hàng");
            return ReviewDto.builder()
                    .id(r.getId())
                    .customerId(r.getCustomerId())
                    .customerName(customerName)
                    .rating(r.getRating())
                    .comment(r.getComment())
                    .createdAt(r.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }
}
