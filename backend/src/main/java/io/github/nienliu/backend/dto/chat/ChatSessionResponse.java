package io.github.nienliu.backend.dto.chat;

import java.time.LocalDateTime;

public record ChatSessionResponse(
        Long id,
        Long characterCardId,
        String title,
        LocalDateTime createdAt
) {
}
