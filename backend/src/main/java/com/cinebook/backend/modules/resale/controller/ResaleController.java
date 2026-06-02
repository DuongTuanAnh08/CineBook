package com.cinebook.backend.modules.resale.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.resale.dto.ListingRequest;
import com.cinebook.backend.modules.resale.entity.TicketExchangeListing;
import com.cinebook.backend.modules.resale.service.ResaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resale")
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

    @PutMapping("/{id}/unhide")
    public ApiResponse<TicketExchangeListing> unhide(@PathVariable Long id, @RequestParam Long adminId) {
        return ApiResponse.ok(service.unhideListing(id, adminId));
    }

    @GetMapping
    public ApiResponse<java.util.List<com.cinebook.backend.modules.resale.dto.ResaleListingDto>> getAll() {
        return ApiResponse.ok(service.getAllActiveListings());
    }

    @GetMapping("/admin")
    public ApiResponse<java.util.List<com.cinebook.backend.modules.resale.dto.ResaleListingDto>> getAllAdmin() {
        return ApiResponse.ok(service.getAllListingsForAdmin());
    }

    @GetMapping("/my-listings")
    public ApiResponse<java.util.List<com.cinebook.backend.modules.resale.dto.ResaleListingDto>> getMyListings(@RequestParam Long sellerId) {
        return ApiResponse.ok(service.getMyListings(sellerId));
    }

    @PutMapping("/{id}")
    public ApiResponse<TicketExchangeListing> update(
            @PathVariable Long id,
            @RequestParam Long sellerId,
            @RequestParam Integer askingPrice,
            @RequestParam(required = false) String note) {
        return ApiResponse.ok(service.updateListing(id, sellerId, askingPrice, note));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            @RequestParam Long sellerId) {
        service.deleteListing(id, sellerId);
        return ApiResponse.ok(null);
    }
}
