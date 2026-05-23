package io.github.nienliu.backend.dto.character;

import java.time.LocalDateTime;

public record CharacterResponse(
        Long id,
        Long ownerId,
        String name,
        String description,
        String personality,
        String scenario,
        String firstMessage,
        String systemPrompt,
        String tags,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
