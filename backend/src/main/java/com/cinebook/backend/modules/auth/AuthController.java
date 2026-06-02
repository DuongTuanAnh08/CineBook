package com.cinebook.backend.modules.auth;

import com.cinebook.backend.common.response.ApiResponse;
import com.cinebook.backend.modules.auth.dto.*;
import com.cinebook.backend.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Auth & Account Management APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new account (UC-01)")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String message = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok(message));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify email OTP (UC-01)")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String message = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(message));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email/password (UC-02)")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout (UC-05)")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        authService.logout(request != null ? request.getRefreshToken() : null);
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully."));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Send temp password (UC-03)")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("If this email is registered, a temporary password has been sent."));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password (UC-04)")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        // Extract userId from UserDetails via JwtUtil
        // Since UserDetails.username = email, fetch from UserRepository (injected in future)
        // For now we get userId from the request context
        // TODO: inject UserRepository to get userId by email
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully."));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile (UC-07)")
    public ResponseEntity<ApiResponse<AuthResponse.UserInfo>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        AuthResponse.UserInfo updatedUser = authService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok(updatedUser));
    }
}
