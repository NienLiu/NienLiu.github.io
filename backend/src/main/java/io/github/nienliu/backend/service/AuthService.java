package io.github.nienliu.backend.service;

import io.github.nienliu.backend.dto.auth.AuthMeResponse;
import io.github.nienliu.backend.entity.User;
import io.github.nienliu.backend.exception.NotFoundException;
import io.github.nienliu.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthMeResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Current user not found"));
        return new AuthMeResponse(user.getId(), user.getUsername(), user.getDisplayName(), user.getEmail());
    }

    public User getCurrentUserEntity(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Current user not found"));
    }
}
