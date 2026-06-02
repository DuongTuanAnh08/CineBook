import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class CodeGenerator {
    public static void main(String[] args) throws IOException {
        String baseDir = "c:/Users/Dell/Downloads/CineBook/backend/src/main/java/com/cinebook/backend/modules/";

        // 1. FnB Module
        createFile(baseDir + "fnb/entity/FnBProductCategory.java", """
package com.cinebook.backend.modules.fnb.entity;

public enum FnBProductCategory {
    Popcorn, Drink, Combo
}
""");

        createFile(baseDir + "fnb/entity/FnBProductStatus.java", """
package com.cinebook.backend.modules.fnb.entity;

public enum FnBProductStatus {
    Active, Inactive
}
""");

        createFile(baseDir + "fnb/entity/FnBProduct.java", """
package com.cinebook.backend.modules.fnb.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "FnBProducts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FnBProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FnBProductCategory category;

    @Column(nullable = false)
    private Integer price;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FnBProductStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
""");

        createFile(baseDir + "bookings/entity/FnBOrderItem.java", """
package com.cinebook.backend.modules.bookings.entity;

import jakarta.persistence.*;
import lombok.*;
import com.cinebook.backend.modules.fnb.entity.FnBProduct;

@Entity
@Table(name = "FnBOrderItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FnBOrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private FnBProduct product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private Integer unitPrice;
}
""");

        createFile(baseDir + "fnb/repository/FnBProductRepository.java", """
package com.cinebook.backend.modules.fnb.repository;

import com.cinebook.backend.modules.fnb.entity.FnBProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FnBProductRepository extends JpaRepository<FnBProduct, Long> {
}
""");

        createFile(baseDir + "fnb/dto/FnBProductRequest.java", """
package com.cinebook.backend.modules.fnb.dto;

import com.cinebook.backend.modules.fnb.entity.FnBProductCategory;
import com.cinebook.backend.modules.fnb.entity.FnBProductStatus;
import lombok.Data;

@Data
public class FnBProductRequest {
    private String name;
    private String description;
    private FnBProductCategory category;
    private Integer price;
    private String imageUrl;
    private FnBProductStatus status;
}
""");

        createFile(baseDir + "fnb/service/FnBProductService.java", """
package com.cinebook.backend.modules.fnb.service;

import com.cinebook.backend.modules.fnb.dto.FnBProductRequest;
import com.cinebook.backend.modules.fnb.entity.FnBProduct;
import com.cinebook.backend.modules.fnb.repository.FnBProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FnBProductService {
    private final FnBProductRepository repository;

    public Page<FnBProduct> getAllProducts(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public FnBProduct getProductById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public FnBProduct createProduct(FnBProductRequest request) {
        FnBProduct product = FnBProduct.Builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus())
                .build();
        return repository.save(product);
    }

    public FnBProduct updateProduct(Long id, FnBProductRequest request) {
        FnBProduct product = getProductById(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setStatus(request.getStatus());
        return repository.save(product);
    }

    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }
}
""");

        createFile(baseDir + "fnb/controller/FnBProductController.java", """
package com.cinebook.backend.modules.fnb.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.fnb.dto.FnBProductRequest;
import com.cinebook.backend.modules.fnb.entity.FnBProduct;
import com.cinebook.backend.modules.fnb.service.FnBProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/fnb/products")
@RequiredArgsConstructor
public class FnBProductController {
    private final FnBProductService service;

    @GetMapping
    public ApiResponse<Page<FnBProduct>> getAll(Pageable pageable) {
        return ApiResponse.ok(service.getAllProducts(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<FnBProduct> getById(@PathVariable Long id) {
        return ApiResponse.ok(service.getProductById(id));
    }

    @PostMapping
    public ApiResponse<FnBProduct> create(@RequestBody FnBProductRequest request) {
        return ApiResponse.ok(service.createProduct(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<FnBProduct> update(@PathVariable Long id, @RequestBody FnBProductRequest request) {
        return ApiResponse.ok(service.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.deleteProduct(id);
        return ApiResponse.ok(null);
    }
}
""");

        // 2. Promos
        createFile(baseDir + "promos/entity/PromoDiscountType.java", """
package com.cinebook.backend.modules.promos.entity;

public enum PromoDiscountType {
    Percentage, FixedAmount
}
""");

        createFile(baseDir + "promos/entity/PromoStatus.java", """
package com.cinebook.backend.modules.promos.entity;

public enum PromoStatus {
    Active, Inactive
}
""");

        createFile(baseDir + "promos/entity/PromoCode.java", """
package com.cinebook.backend.modules.promos.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "PromoCodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promo_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private PromoDiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "max_discount_vnd")
    private Integer maxDiscountVnd;

    @Column(name = "min_order_value")
    private Integer minOrderValue;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;

    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @Column(name = "valid_until", nullable = false)
    private LocalDateTime validUntil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromoStatus status;

    @Column(name = "created_by")
    private Long createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
""");

        createFile(baseDir + "promos/entity/PromoUsage.java", """
package com.cinebook.backend.modules.promos.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "PromoUsages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usage_id")
    private Long id;

    @Column(name = "promo_id", nullable = false)
    private Long promoId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @CreationTimestamp
    @Column(name = "used_at", nullable = false, updatable = false)
    private LocalDateTime usedAt;
}
""");

        createFile(baseDir + "promos/repository/PromoCodeRepository.java", """
package com.cinebook.backend.modules.promos.repository;

import com.cinebook.backend.modules.promos.entity.PromoCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {
    Optional<PromoCode> findByCode(String code);
}
""");

        createFile(baseDir + "promos/repository/PromoUsageRepository.java", """
package com.cinebook.backend.modules.promos.repository;

import com.cinebook.backend.modules.promos.entity.PromoUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromoUsageRepository extends JpaRepository<PromoUsage, Long> {
    long countByPromoIdAndUserId(Long promoId, Long userId);
}
""");

        createFile(baseDir + "promos/service/PromoService.java", """
package com.cinebook.backend.modules.promos.service;

import com.cinebook.backend.modules.promos.entity.PromoCode;
import com.cinebook.backend.modules.promos.entity.PromoStatus;
import com.cinebook.backend.modules.promos.repository.PromoCodeRepository;
import com.cinebook.backend.modules.promos.repository.PromoUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PromoService {
    private final PromoCodeRepository promoCodeRepository;
    private final PromoUsageRepository promoUsageRepository;

    public boolean validatePromo(String code, Long userId, Integer orderValue) {
        PromoCode promo = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Promo not found"));

        if (promo.getStatus() != PromoStatus.Active) {
            throw new RuntimeException("Promo is inactive");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(promo.getValidFrom()) || now.isAfter(promo.getValidUntil())) {
            throw new RuntimeException("Promo is expired or not yet valid");
        }

        if (promo.getMinOrderValue() != null && orderValue < promo.getMinOrderValue()) {
            throw new RuntimeException("Order value does not meet minimum requirement");
        }

        if (promo.getUsageLimit() != null && promo.getUsedCount() >= promo.getUsageLimit()) {
            throw new RuntimeException("Promo usage limit exceeded");
        }

        long userUsageCount = promoUsageRepository.countByPromoIdAndUserId(promo.getId(), userId);
        if (userUsageCount > 0) {
            throw new RuntimeException("User has already used this promo");
        }

        return true;
    }
}
""");

        createFile(baseDir + "promos/controller/PromoController.java", """
package com.cinebook.backend.modules.promos.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.promos.service.PromoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/promos")
@RequiredArgsConstructor
public class PromoController {
    private final PromoService service;

    @GetMapping("/validate")
    public ApiResponse<Boolean> validatePromo(
            @RequestParam String code,
            @RequestParam Long userId,
            @RequestParam Integer orderValue) {
        try {
            boolean isValid = service.validatePromo(code, userId, orderValue);
            return ApiResponse.ok(isValid);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
""");

        // 3. Reviews
        createFile(baseDir + "reviews/entity/ReviewStatus.java", """
package com.cinebook.backend.modules.reviews.entity;

public enum ReviewStatus {
    Active, Deleted
}
""");

        createFile(baseDir + "reviews/entity/Review.java", """
package com.cinebook.backend.modules.reviews.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
""");

        createFile(baseDir + "reviews/repository/ReviewRepository.java", """
package com.cinebook.backend.modules.reviews.repository;

import com.cinebook.backend.modules.reviews.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
}
""");

        createFile(baseDir + "reviews/dto/ReviewRequest.java", """
package com.cinebook.backend.modules.reviews.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long customerId;
    private Long movieId;
    private Long bookingId;
    private Integer rating;
    private String comment;
}
""");

        createFile(baseDir + "reviews/service/ReviewService.java", """
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
""");

        createFile(baseDir + "reviews/controller/ReviewController.java", """
package com.cinebook.backend.modules.reviews.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.reviews.dto.ReviewRequest;
import com.cinebook.backend.modules.reviews.entity.Review;
import com.cinebook.backend.modules.reviews.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
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
            return ApiResponse.error(e.getMessage());
        }
    }
}
""");

        // 4. Resale
        createFile(baseDir + "resale/entity/ListingStatus.java", """
package com.cinebook.backend.modules.resale.entity;

public enum ListingStatus {
    Active, Cancelled, Expired, Delisted, Hidden
}
""");

        createFile(baseDir + "resale/entity/TicketExchangeListing.java", """
package com.cinebook.backend.modules.resale.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "TicketExchangeListings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketExchangeListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "listing_id")
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "asking_price", nullable = false)
    private Integer askingPrice;

    @Column(length = 200)
    private String note;

    @Column(length = 20)
    private String phone;

    @Column(name = "facebook_url", length = 300)
    private String facebookUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status;

    @Column(name = "hidden_by")
    private Long hiddenBy;

    @Column(name = "hidden_at")
    private LocalDateTime hiddenAt;

    @Column(name = "hidden_reason", columnDefinition = "TEXT")
    private String hiddenReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
""");

        createFile(baseDir + "resale/repository/TicketExchangeListingRepository.java", """
package com.cinebook.backend.modules.resale.repository;

import com.cinebook.backend.modules.resale.entity.TicketExchangeListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketExchangeListingRepository extends JpaRepository<TicketExchangeListing, Long> {
}
""");

        createFile(baseDir + "resale/dto/ListingRequest.java", """
package com.cinebook.backend.modules.resale.dto;

import lombok.Data;

@Data
public class ListingRequest {
    private Long bookingId;
    private Long sellerId;
    private Integer askingPrice;
    private String note;
    private String phone;
    private String facebookUrl;
}
""");

        createFile(baseDir + "resale/service/ResaleService.java", """
package com.cinebook.backend.modules.resale.service;

import com.cinebook.backend.modules.resale.entity.ListingStatus;
import com.cinebook.backend.modules.resale.entity.TicketExchangeListing;
import com.cinebook.backend.modules.resale.repository.TicketExchangeListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ResaleService {
    private final TicketExchangeListingRepository repository;

    public TicketExchangeListing createListing(Long bookingId, Long sellerId, Integer askingPrice, String note, String phone, String facebookUrl) {
        TicketExchangeListing listing = TicketExchangeListing.builder()
                .bookingId(bookingId)
                .sellerId(sellerId)
                .askingPrice(askingPrice)
                .note(note)
                .phone(phone)
                .facebookUrl(facebookUrl)
                .status(ListingStatus.Active)
                .build();
        return repository.save(listing);
    }

    public TicketExchangeListing hideListing(Long listingId, Long adminId, String reason) {
        TicketExchangeListing listing = repository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        listing.setStatus(ListingStatus.Hidden);
        listing.setHiddenBy(adminId);
        listing.setHiddenAt(LocalDateTime.now());
        listing.setHiddenReason(reason);
        return repository.save(listing);
    }
}
""");

        createFile(baseDir + "resale/controller/ResaleController.java", """
package com.cinebook.backend.modules.resale.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.resale.dto.ListingRequest;
import com.cinebook.backend.modules.resale.entity.TicketExchangeListing;
import com.cinebook.backend.modules.resale.service.ResaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resale")
@RequiredArgsConstructor
public class ResaleController {
    private final ResaleService service;

    @PostMapping
    public ApiResponse<TicketExchangeListing> create(@RequestBody ListingRequest request) {
        return ApiResponse.ok(service.createListing(
                request.getBookingId(),
                request.getSellerId(),
                request.getAskingPrice(),
                request.getNote(),
                request.getPhone(),
                request.getFacebookUrl()
        ));
    }

    @PutMapping("/{id}/hide")
    public ApiResponse<TicketExchangeListing> hide(@PathVariable Long id, @RequestParam Long adminId, @RequestParam String reason) {
        return ApiResponse.ok(service.hideListing(id, adminId, reason));
    }
}
""");

        // 5. News
        createFile(baseDir + "news/entity/NewsStatus.java", """
package com.cinebook.backend.modules.news.entity;

public enum NewsStatus {
    Draft, Published, Hidden
}
""");

        createFile(baseDir + "news/entity/NewsArticle.java", """
package com.cinebook.backend.modules.news.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "NewsArticles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "article_id")
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(nullable = false, columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "publish_date", nullable = false)
    private LocalDateTime publishDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NewsStatus status;

    @Column(name = "created_by")
    private Long createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
""");

        createFile(baseDir + "news/repository/NewsArticleRepository.java", """
package com.cinebook.backend.modules.news.repository;

import com.cinebook.backend.modules.news.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
}
""");

        createFile(baseDir + "news/dto/NewsArticleRequest.java", """
package com.cinebook.backend.modules.news.dto;

import com.cinebook.backend.modules.news.entity.NewsStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NewsArticleRequest {
    private String title;
    private String summary;
    private String content;
    private String thumbnailUrl;
    private LocalDateTime publishDate;
    private NewsStatus status;
}
""");

        createFile(baseDir + "news/service/NewsService.java", """
package com.cinebook.backend.modules.news.service;

import com.cinebook.backend.modules.news.dto.NewsArticleRequest;
import com.cinebook.backend.modules.news.entity.NewsArticle;
import com.cinebook.backend.modules.news.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsArticleRepository repository;

    public Page<NewsArticle> getAllArticles(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public NewsArticle getArticleById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Article not found"));
    }

    public NewsArticle createArticle(NewsArticleRequest request, Long createdBy) {
        NewsArticle article = NewsArticle.builder()
                .title(request.getTitle())
                .summary(request.getSummary())
                .content(request.getContent())
                .thumbnailUrl(request.getThumbnailUrl())
                .publishDate(request.getPublishDate() != null ? request.getPublishDate() : java.time.LocalDateTime.now())
                .status(request.getStatus())
                .createdBy(createdBy)
                .build();
        return repository.save(article);
    }

    public NewsArticle updateArticle(Long id, NewsArticleRequest request) {
        NewsArticle article = getArticleById(id);
        article.setTitle(request.getTitle());
        article.setSummary(request.getSummary());
        article.setContent(request.getContent());
        article.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getPublishDate() != null) {
            article.setPublishDate(request.getPublishDate());
        }
        article.setStatus(request.getStatus());
        return repository.save(article);
    }

    public void deleteArticle(Long id) {
        repository.deleteById(id);
    }
}
""");

        createFile(baseDir + "news/controller/NewsController.java", """
package com.cinebook.backend.modules.news.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.news.dto.NewsArticleRequest;
import com.cinebook.backend.modules.news.entity.NewsArticle;
import com.cinebook.backend.modules.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsService service;

    @GetMapping
    public ApiResponse<Page<NewsArticle>> getAll(Pageable pageable) {
        return ApiResponse.ok(service.getAllArticles(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<NewsArticle> getById(@PathVariable Long id) {
        return ApiResponse.ok(service.getArticleById(id));
    }

    @PostMapping
    public ApiResponse<NewsArticle> create(@RequestBody NewsArticleRequest request, @RequestParam(required = false) Long createdBy) {
        return ApiResponse.ok(service.createArticle(request, createdBy));
    }

    @PutMapping("/{id}")
    public ApiResponse<NewsArticle> update(@PathVariable Long id, @RequestBody NewsArticleRequest request) {
        return ApiResponse.ok(service.updateArticle(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.deleteArticle(id);
        return ApiResponse.ok(null);
    }
}
""");

        System.out.println("Done generating files.");
    }

    private static void createFile(String filePath, String content) throws IOException {
        Path path = Paths.get(filePath);
        Files.createDirectories(path.getParent());
        Files.writeString(path, content);
    }
}
