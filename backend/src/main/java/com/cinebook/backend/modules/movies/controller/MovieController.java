package com.cinebook.backend.modules.movies.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.movies.dto.MovieRequest;
import com.cinebook.backend.modules.movies.entity.Movie;
import com.cinebook.backend.modules.movies.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {
    private final MovieService movieService;

    @GetMapping
    public ApiResponse<Page<Movie>> getAllMovies(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ApiResponse.ok(movieService.getAllMovies(status, search, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<Movie> getMovieById(@PathVariable Long id) {
        return ApiResponse.ok(movieService.getMovieById(id));
    }

    @PostMapping
    public ApiResponse<Movie> createMovie(@RequestBody MovieRequest request) {
        return ApiResponse.ok(movieService.createMovie(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Movie> updateMovie(@PathVariable Long id, @RequestBody MovieRequest request) {
        return ApiResponse.ok(movieService.updateMovie(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ApiResponse.ok("Movie deleted successfully");
    }
}
