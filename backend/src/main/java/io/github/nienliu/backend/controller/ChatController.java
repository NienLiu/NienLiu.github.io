package io.github.nienliu.backend.controller;

import io.github.nienliu.backend.dto.chat.*;
import io.github.nienliu.backend.entity.User;
import io.github.nienliu.backend.service.AuthService;
import io.github.nienliu.backend.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat/sessions")
public class ChatController {

    private final ChatService chatService;
    private final AuthService authService;

    public ChatController(ChatService chatService, AuthService authService) {
        this.chatService = chatService;
        this.authService = authService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChatSessionResponse createSession(@RequestBody @Valid CreateSessionRequest request, Principal principal) {
        User user = authService.getCurrentUserEntity(principal.getName());
        return chatService.createSession(user, request);
    }

    @PostMapping("/{id}/messages")
    public SendMessageResponse sendMessage(@PathVariable Long id,
                                           @RequestBody @Valid SendMessageRequest request,
                                           Principal principal) {
        User user = authService.getCurrentUserEntity(principal.getName());
        return chatService.sendMessage(user, id, request);
    }

    @GetMapping("/{id}/messages")
    public List<ChatMessageResponse> getMessages(@PathVariable Long id, Principal principal) {
        User user = authService.getCurrentUserEntity(principal.getName());
        return chatService.getMessages(user, id);
    }
}
