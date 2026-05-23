package io.github.nienliu.backend.controller;

import io.github.nienliu.backend.dto.character.CharacterCreateRequest;
import io.github.nienliu.backend.dto.character.CharacterResponse;
import io.github.nienliu.backend.dto.character.CharacterUpdateRequest;
import io.github.nienliu.backend.entity.User;
import io.github.nienliu.backend.service.AuthService;
import io.github.nienliu.backend.service.CharacterService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

    private static final Logger log = LoggerFactory.getLogger(CharacterController.class);

    private final CharacterService characterService;
    private final AuthService authService;

    public CharacterController(CharacterService characterService, AuthService authService) {
        this.characterService = characterService;
        this.authService = authService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CharacterResponse create(@RequestBody @Valid CharacterCreateRequest request, Principal principal) {
        User user = authService.getCurrentUserEntity(principal.getName());
        CharacterResponse response = characterService.create(user, request);
        log.info("Character {} created by {}", response.id(), principal.getName());
        return response;
    }

    @GetMapping
    public List<CharacterResponse> list(Principal principal) {
        User user = authService.getCurrentUserEntity(principal.getName());
        return characterService.list(user);
    }

    @GetMapping("/{id}")
    public CharacterResponse get(@PathVariable Long id, Principal principal) {
        User user = authService.getCurrentUserEntity(principal.getName());
        return characterService.get(user, id);
    }

    @PutMapping("/{id}")
    public CharacterResponse update(@PathVariable Long id, @RequestBody @Valid CharacterUpdateRequest request, Principal principal) {
        User user = authService.getCurrentUserEntity(principal.getName());
        return characterService.update(user, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Principal principal) {
        User user = authService.getCurrentUserEntity(principal.getName());
        characterService.delete(user, id);
    }
}
