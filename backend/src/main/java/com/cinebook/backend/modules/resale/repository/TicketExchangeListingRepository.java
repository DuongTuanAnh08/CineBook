package com.cinebook.backend.modules.resale.repository;

import com.cinebook.backend.modules.resale.entity.TicketExchangeListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketExchangeListingRepository extends JpaRepository<TicketExchangeListing, Long> {
}
