package io.github.nienliu.backend.repository;

import io.github.nienliu.backend.entity.CharacterCard;
import io.github.nienliu.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CharacterCardRepository extends JpaRepository<CharacterCard, Long> {
    List<CharacterCard> findByOwnerOrderByUpdatedAtDesc(User owner);

    Optional<CharacterCard> findByIdAndOwner(Long id, User owner);
}
