package com.cinebook.backend.modules.movies.repository;

import com.cinebook.backend.modules.movies.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByStatusAndReleaseDateLessThanEqual(String status, LocalDate date);
}
