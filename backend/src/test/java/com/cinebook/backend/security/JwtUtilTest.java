package com.cinebook.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtUtil, "accessTokenExpirationMs", 86400000L); // 1 day
        ReflectionTestUtils.setField(jwtUtil, "refreshTokenExpirationMs", 604800000L); // 7 days
    }

    @Test
    void testGenerateToken() {
        String token = jwtUtil.generateAccessToken(1L, "test@example.com", "USER");
        assertNotNull(token);
        assertFalse(token.isEmpty());

        Long extractedId = jwtUtil.getUserIdFromToken(token);
        assertEquals(1L, extractedId);
    }

    @Test
    void testValidateToken() {
        String token = jwtUtil.generateAccessToken(1L, "test@example.com", "USER");
        assertTrue(jwtUtil.validateToken(token));
    }

    @Test
    void testValidateInvalidToken() {
        assertFalse(jwtUtil.validateToken("invalid.token.here"));
    }
}
