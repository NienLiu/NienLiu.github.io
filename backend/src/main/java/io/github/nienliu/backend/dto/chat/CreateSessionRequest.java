package io.github.nienliu.backend.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateSessionRequest(
        @NotNull Long characterCardId,
        @NotBlank @Size(max = 150) String title
) {
}
