package io.github.nienliu.backend.dto.auth;

public record AuthMeResponse(
        Long id,
        String username,
        String displayName,
        String email
) {
}
