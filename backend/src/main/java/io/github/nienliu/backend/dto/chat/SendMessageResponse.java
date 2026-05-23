package io.github.nienliu.backend.dto.chat;

public record SendMessageResponse(
        Long sessionId,
        ChatMessageResponse userMessage,
        ChatMessageResponse assistantMessage
) {
}
