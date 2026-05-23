package io.github.nienliu.backend.repository;

import io.github.nienliu.backend.entity.ChatSession;
import io.github.nienliu.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findByIdAndOwner(Long id, User owner);
}
