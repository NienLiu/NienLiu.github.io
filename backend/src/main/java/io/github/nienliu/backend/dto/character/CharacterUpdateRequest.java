package io.github.nienliu.backend.dto.character;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CharacterUpdateRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 500) String description,
        @NotBlank @Size(max = 500) String personality,
        @NotBlank @Size(max = 500) String scenario,
        @NotBlank @Size(max = 1000) String firstMessage,
        @Size(max = 2000) String systemPrompt,
        @Size(max = 255) String tags
) {
}
