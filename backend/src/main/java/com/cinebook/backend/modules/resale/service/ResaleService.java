package com.cinebook.backend.modules.resale.service;

import com.cinebook.backend.modules.resale.entity.ListingStatus;
import com.cinebook.backend.modules.resale.entity.TicketExchangeListing;
import com.cinebook.backend.modules.resale.repository.TicketExchangeListingRepository;
import com.cinebook.backend.modules.resale.dto.ResaleListingDto;
import com.cinebook.backend.modules.bookings.repository.BookingRepository;
import com.cinebook.backend.modules.bookings.repository.BookingSeatRepository;
import com.cinebook.backend.modules.users.UserRepository;
import com.cinebook.backend.modules.bookings.entity.Booking;
import com.cinebook.backend.modules.users.User;
import com.cinebook.backend.modules.bookings.entity.BookingSeat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResaleService {
    private final TicketExchangeListingRepository repository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final UserRepository userRepository;

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

    public TicketExchangeListing unhideListing(Long listingId, Long adminId) {
        TicketExchangeListing listing = repository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        listing.setStatus(ListingStatus.Active);
        listing.setHiddenBy(null);
        listing.setHiddenAt(null);
        listing.setHiddenReason(null);
        return repository.save(listing);
    }

    public List<ResaleListingDto> getAllActiveListings() {
        return repository.findAll().stream()
                .filter(l -> l.getStatus() == ListingStatus.Active)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ResaleListingDto> getAllListingsForAdmin() {
        return repository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ResaleListingDto> getMyListings(Long sellerId) {
        return repository.findAll().stream()
                .filter(l -> l.getSellerId().equals(sellerId) && l.getStatus() != ListingStatus.Deleted)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TicketExchangeListing updateListing(Long listingId, Long sellerId, Integer askingPrice, String note) {
        TicketExchangeListing listing = repository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (!listing.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Not authorized to update this listing");
        }
        listing.setAskingPrice(askingPrice);
        listing.setNote(note);
        return repository.save(listing);
    }

    public void deleteListing(Long listingId, Long sellerId) {
        TicketExchangeListing listing = repository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (!listing.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Not authorized to delete this listing");
        }
        listing.setStatus(ListingStatus.Deleted);
        repository.save(listing);
    }

    private ResaleListingDto mapToDto(TicketExchangeListing listing) {
        Booking booking = bookingRepository.findById(listing.getBookingId()).orElse(null);
        User seller = userRepository.findById(listing.getSellerId()).orElse(null);
        
        String seats = "";
        String movieTitle = "";
        String cinemaName = "";
        String roomName = "";
        String showDate = "";
        String showTime = "";
        Integer originalPrice = 0;

        if (booking != null) {
            List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking_Id(booking.getId());
            seats = bookingSeats.stream()
                    .map(s -> s.getSeat().getSeatLabel())
                    .collect(Collectors.joining(", "));
            
            movieTitle = booking.getShowtime().getMovie().getTitle();
            cinemaName = booking.getShowtime().getRoom().getCinema().getName();
            roomName = booking.getShowtime().getRoom().getName();
            showDate = booking.getShowtime().getStartTime().toLocalDate().toString();
            showTime = booking.getShowtime().getStartTime().toLocalTime().toString();
            originalPrice = booking.getTotalAfterTax();
        }

        return ResaleListingDto.builder()
                .id(listing.getId())
                .bookingId(listing.getBookingId())
                .sellerId(listing.getSellerId())
                .sellerName(seller != null ? seller.getFullName() : "Unknown")
                .movieTitle(movieTitle)
                .cinemaName(cinemaName)
                .roomName(roomName)
                .showDate(showDate)
                .showTime(showTime)
                .seats(seats)
                .originalPrice(originalPrice)
                .askingPrice(listing.getAskingPrice())
                .note(listing.getNote())
                .phone(listing.getPhone())
                .facebookUrl(listing.getFacebookUrl())
                .status(listing.getStatus())
                .createdAt(listing.getCreatedAt())
                .build();
    }
}
