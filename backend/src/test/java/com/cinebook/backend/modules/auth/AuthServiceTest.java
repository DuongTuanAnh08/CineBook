package com.cinebook.backend.modules.auth;

import com.cinebook.backend.common.exception.AppException;
import com.cinebook.backend.modules.auth.dto.AuthResponse;
import com.cinebook.backend.modules.auth.dto.LoginRequest;
import com.cinebook.backend.modules.auth.dto.RegisterRequest;
import com.cinebook.backend.modules.users.User;
import com.cinebook.backend.modules.users.UserRepository;
import com.cinebook.backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void testRegister_EmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("johndoe@example.com");

        when(userRepository.existsByEmailAndDeletedAtIsNull(request.getEmail())).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> authService.register(request));
        assertEquals("Email is already registered. Please login or reset your password.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void testLogin_UserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("johndoe@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> authService.login(request));
        assertEquals("Incorrect email or password. Please check again.", exception.getMessage());
    }
}
