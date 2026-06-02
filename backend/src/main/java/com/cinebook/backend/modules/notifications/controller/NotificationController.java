package com.cinebook.backend.modules.notifications.controller;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.notifications.entity.Notification;
import com.cinebook.backend.modules.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping
    public ApiResponse<List<Notification>> getUserNotifications(@RequestParam(required = false) Long userId) {
        // In real app, userId should come from token via Spring Security context.
        // For testing we allow passing it, but default to 1 if null.
        Long targetUserId = userId != null ? userId : 1L;
        return ApiResponse.ok(service.getNotificationsForUser(targetUserId));
    }

    @PutMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
        return ApiResponse.ok(null);
    }

    @PutMapping("/read-all")
    public ApiResponse<Void> markAllAsRead(@RequestParam(required = false) Long userId) {
        Long targetUserId = userId != null ? userId : 1L;
        service.markAllAsRead(targetUserId);
        return ApiResponse.ok(null);
    }
}
