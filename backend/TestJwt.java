import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;

public class TestJwt {
    public static void main(String[] args) {
        String secret = "cinebook-super-secret-key-must-be-at-least-256-bits-long-for-hs256";
        String token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlN5c3RlbUFkbWluIiwiZW1haWwiOiJhZG1pbkBjaW5lYm9vay52biIsImlhdCI6MTc4MDI4MzUyNiwiZXhwIjoxNzgwMzY5OTI2fQ.yJA8EPOxcqRdtov0ygWsNuAWB43JuxX7tWgAK4U8KvwsMFAitCXq2nwxdZqUuLiNaf8KxY264lGChrM61LdtWw";
        try {
            Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token);
            System.out.println("Signature valid!");
        } catch (Exception e) {
            System.out.println("Signature INVALID: " + e.getMessage());
        }
    }
}
