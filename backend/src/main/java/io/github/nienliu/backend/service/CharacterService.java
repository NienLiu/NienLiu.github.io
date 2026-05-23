package io.github.nienliu.backend.service;

import io.github.nienliu.backend.dto.character.CharacterCreateRequest;
import io.github.nienliu.backend.dto.character.CharacterResponse;
import io.github.nienliu.backend.dto.character.CharacterUpdateRequest;
import io.github.nienliu.backend.entity.CharacterCard;
import io.github.nienliu.backend.entity.User;
import io.github.nienliu.backend.exception.NotFoundException;
import io.github.nienliu.backend.repository.CharacterCardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CharacterService {

    private final CharacterCardRepository characterCardRepository;

    public CharacterService(CharacterCardRepository characterCardRepository) {
        this.characterCardRepository = characterCardRepository;
    }

    @Transactional
    public CharacterResponse create(User owner, CharacterCreateRequest request) {
        CharacterCard card = new CharacterCard();
        card.setOwner(owner);
        apply(card, request.name(), request.description(), request.personality(), request.scenario(), request.firstMessage(), request.systemPrompt(), request.tags());
        return toResponse(characterCardRepository.save(card));
    }

    @Transactional(readOnly = true)
    public List<CharacterResponse> list(User owner) {
        return characterCardRepository.findByOwnerOrderByUpdatedAtDesc(owner)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CharacterResponse get(User owner, Long id) {
        return toResponse(findByIdAndOwner(owner, id));
    }

    @Transactional
    public CharacterResponse update(User owner, Long id, CharacterUpdateRequest request) {
        CharacterCard card = findByIdAndOwner(owner, id);
        apply(card, request.name(), request.description(), request.personality(), request.scenario(), request.firstMessage(), request.systemPrompt(), request.tags());
        return toResponse(characterCardRepository.save(card));
    }

    @Transactional
    public void delete(User owner, Long id) {
        CharacterCard card = findByIdAndOwner(owner, id);
        characterCardRepository.delete(card);
    }

    @Transactional(readOnly = true)
    public CharacterCard findByIdAndOwner(User owner, Long id) {
        return characterCardRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new NotFoundException("Character card not found"));
    }

    private void apply(CharacterCard card,
                       String name,
                       String description,
                       String personality,
                       String scenario,
                       String firstMessage,
                       String systemPrompt,
                       String tags) {
        card.setName(name);
        card.setDescription(description);
        card.setPersonality(personality);
        card.setScenario(scenario);
        card.setFirstMessage(firstMessage);
        card.setSystemPrompt(systemPrompt);
        card.setTags(tags);
    }

    private CharacterResponse toResponse(CharacterCard card) {
        return new CharacterResponse(
                card.getId(),
                card.getOwner().getId(),
                card.getName(),
                card.getDescription(),
                card.getPersonality(),
                card.getScenario(),
                card.getFirstMessage(),
                card.getSystemPrompt(),
                card.getTags(),
                card.getCreatedAt(),
                card.getUpdatedAt()
        );
    }
}
