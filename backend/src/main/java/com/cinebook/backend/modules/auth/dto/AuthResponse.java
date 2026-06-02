package com.cinebook.backend.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private Long userId;
        private String fullName;
        private String email;
        private String role;
        private String avatarUrl;
    }
}
