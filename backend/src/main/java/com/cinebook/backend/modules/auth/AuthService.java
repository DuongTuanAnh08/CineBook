package com.cinebook.backend.modules.auth;

import com.cinebook.backend.common.enums.UserRole;
import com.cinebook.backend.common.enums.UserStatus;
import com.cinebook.backend.common.exception.AppException;
import com.cinebook.backend.modules.auth.dto.*;
import com.cinebook.backend.modules.auth.entity.OtpToken;
import com.cinebook.backend.modules.auth.entity.OtpToken.OtpType;
import com.cinebook.backend.modules.auth.entity.RefreshToken;
import com.cinebook.backend.modules.auth.repository.OtpTokenRepository;
import com.cinebook.backend.modules.auth.repository.RefreshTokenRepository;
import com.cinebook.backend.modules.users.User;
import com.cinebook.backend.modules.users.UserRepository;
import com.cinebook.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;
    private static final int OTP_VALIDITY_MINUTES = 10;
    private static final int MAX_OTP_RETRIES = 3;

    private final UserRepository userRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmailAndDeletedAtIsNull(request.getEmail())) {
            throw AppException.conflict("Email is already registered. Please login or reset your password.");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .role(UserRole.Customer)
                .status(UserStatus.Inactive) // Inactive until OTP verified
                .failedLoginAttempts(0)
                .build();
        userRepository.save(user);

        String otp = generateOtp();
        saveOtp(user, otp, OtpType.EmailVerification);

        emailService.sendVerificationOtp(user.getEmail(), otp);
        log.info("[DEV MODE] OTP for {} : {}", request.getEmail(), otp);

        return "Registration successful. Please check your email (or console in dev mode) for OTP verification.";
    }

    @Transactional
    public String verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> AppException.notFound("User not found."));

        OtpToken otp = otpTokenRepository.findTopByUserAndTokenTypeAndIsUsedFalseOrderByCreatedAtDesc(
                user, OtpType.EmailVerification)
                .orElseThrow(() -> AppException.badRequest("No valid OTP found. Please request a new one."));

        if (otp.isUsed()) throw AppException.badRequest("OTP already used.");
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) throw AppException.badRequest("OTP has expired. Please request a new one.");
        if (otp.getRetryCount() >= MAX_OTP_RETRIES) throw AppException.badRequest("Too many OTP attempts. Please request a new OTP.");

        if (!passwordEncoder.matches(request.getOtp(), otp.getTokenValue())) {
            otp.setRetryCount(otp.getRetryCount() + 1);
            otpTokenRepository.save(otp);
            throw AppException.badRequest("Incorrect OTP. " + (MAX_OTP_RETRIES - otp.getRetryCount()) + " attempts remaining.");
        }

        otp.setUsed(true);
        otpTokenRepository.save(otp);
        user.setStatus(UserStatus.Active);
        userRepository.save(user);

        return "Email verified successfully. You can now login.";
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> AppException.unauthorized("Incorrect email or password. Please check again."));

        // Check account lock
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw AppException.unauthorized("Account is temporarily locked due to multiple failed attempts. Please try again later.");
        }

        // Check account status
        if (user.getStatus() == UserStatus.Inactive) {
            throw AppException.unauthorized("Email not verified. Please verify your email first.");
        }
        if (user.getStatus() == UserStatus.Locked) {
            throw AppException.unauthorized("Account is locked. Please contact support.");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
                userRepository.save(user);
                throw AppException.unauthorized("Account locked for 30 minutes due to 5 failed login attempts.");
            }
            userRepository.save(user);
            throw AppException.unauthorized("Incorrect email or password. Please check again.");
        }

        // Reset failed attempts on success
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refreshToken(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHashAndIsRevokedFalse(tokenHash)
                .orElseThrow(() -> AppException.unauthorized("Invalid or expired refresh token."));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw AppException.unauthorized("Refresh token expired. Please login again.");
        }

        // Rotate: revoke old, issue new
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        User user = refreshToken.getUser();
        return buildAuthResponse(user);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken == null) return;
        String tokenHash = hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHashAndIsRevokedFalse(tokenHash).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        // Return generic message regardless to prevent email enumeration
        userRepository.findByEmailAndDeletedAtIsNull(request.getEmail()).ifPresent(user -> {
            String tempPassword = generateTempPassword();
            otpTokenRepository.invalidateAllForUser(user, OtpType.TempPassword);
            saveOtp(user, tempPassword, OtpType.TempPassword);
            user.setPasswordHash(passwordEncoder.encode(tempPassword));
            userRepository.save(user);
            
            emailService.sendTempPassword(user.getEmail(), tempPassword);
            log.info("[DEV MODE] Temp password for {} : {}", request.getEmail(), tempPassword);
        });
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AppException.notFound("User not found."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw AppException.badRequest("Current password is incorrect.");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw AppException.badRequest("New password must not be the same as the current password.");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        // Revoke all refresh tokens for security
        refreshTokenRepository.revokeAllByUser(user);
    }

    @Transactional
    public AuthResponse.UserInfo updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> AppException.notFound("User not found."));
        
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAddress(request.getAddress());
        userRepository.save(user);

        return AuthResponse.UserInfo.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .build();
    }

    public AuthResponse.UserInfo getUserInfoByEmail(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> AppException.notFound("User not found."));
        return AuthResponse.UserInfo.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .build();
    }

    // =========== Private Helpers ===========

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getUserId(), user.getEmail(), user.getRole().name());
        String rawRefreshToken = jwtUtil.generateRefreshToken(user.getUserId());

        // Save hashed refresh token
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(user)
                .tokenHash(hashToken(rawRefreshToken))
                .expiresAt(LocalDateTime.now().plusSeconds(jwtUtil.getRefreshTokenExpirationMs() / 1000))
                .isRevoked(false)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .user(AuthResponse.UserInfo.builder()
                        .userId(user.getUserId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .avatarUrl(user.getAvatarUrl())
                        .phone(user.getPhone())
                        .dateOfBirth(user.getDateOfBirth())
                        .address(user.getAddress())
                        .build())
                .build();
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        // Ensure at least one uppercase, one digit, one special
        sb.append(chars.charAt(random.nextInt(26)));
        sb.append(chars.charAt(26 + random.nextInt(26)));
        sb.append(chars.charAt(52 + random.nextInt(10)));
        sb.append(chars.charAt(62 + random.nextInt(4)));
        for (int i = 4; i < 12; i++) sb.append(chars.charAt(random.nextInt(chars.length())));
        return sb.toString();
    }

    private void saveOtp(User user, String otp, OtpType type) {
        otpTokenRepository.invalidateAllForUser(user, type);
        OtpToken token = OtpToken.builder()
                .user(user)
                .tokenType(type)
                .tokenValue(passwordEncoder.encode(otp)) // Store hashed
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES))
                .isUsed(false)
                .retryCount(0)
                .build();
        otpTokenRepository.save(token);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
