package io.github.nienliu.backend.repository;

import io.github.nienliu.backend.entity.ChatMessage;
import io.github.nienliu.backend.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySessionOrderByCreatedAtAsc(ChatSession session);
}
