package io.github.nienliu.backend.service;

import io.github.nienliu.backend.dto.chat.*;
import io.github.nienliu.backend.entity.*;
import io.github.nienliu.backend.exception.NotFoundException;
import io.github.nienliu.backend.llm.LLMProvider;
import io.github.nienliu.backend.repository.ChatMessageRepository;
import io.github.nienliu.backend.repository.ChatSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final CharacterService characterService;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final LLMProvider llmProvider;

    public ChatService(CharacterService characterService,
                       ChatSessionRepository chatSessionRepository,
                       ChatMessageRepository chatMessageRepository,
                       LLMProvider llmProvider) {
        this.characterService = characterService;
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.llmProvider = llmProvider;
    }

    @Transactional
    public ChatSessionResponse createSession(User owner, CreateSessionRequest request) {
        CharacterCard card = characterService.findByIdAndOwner(owner, request.characterCardId());

        ChatSession session = new ChatSession();
        session.setOwner(owner);
        session.setCharacterCard(card);
        session.setTitle(request.title());
        session = chatSessionRepository.save(session);

        ChatMessage systemMsg = new ChatMessage();
        systemMsg.setSession(session);
        systemMsg.setRole(ChatRole.SYSTEM);
        systemMsg.setContent(composeSystemPrompt(card));
        chatMessageRepository.save(systemMsg);

        ChatMessage firstAssistantMsg = new ChatMessage();
        firstAssistantMsg.setSession(session);
        firstAssistantMsg.setRole(ChatRole.ASSISTANT);
        firstAssistantMsg.setContent(card.getFirstMessage());
        chatMessageRepository.save(firstAssistantMsg);

        return new ChatSessionResponse(session.getId(), card.getId(), session.getTitle(), session.getCreatedAt());
    }

    @Transactional
    public SendMessageResponse sendMessage(User owner, Long sessionId, SendMessageRequest request) {
        ChatSession session = chatSessionRepository.findByIdAndOwner(sessionId, owner)
                .orElseThrow(() -> new NotFoundException("Chat session not found"));

        ChatMessage userMessage = new ChatMessage();
        userMessage.setSession(session);
        userMessage.setRole(ChatRole.USER);
        userMessage.setContent(request.content());
        userMessage = chatMessageRepository.save(userMessage);

        List<ChatMessage> history = chatMessageRepository.findBySessionOrderByCreatedAtAsc(session);
        List<String> textHistory = history.stream()
                .filter(msg -> msg.getRole() != ChatRole.SYSTEM)
                .map(ChatMessage::getContent)
                .toList();

        long started = System.currentTimeMillis();
        String assistantText = llmProvider.generateReply(session.getCharacterCard(), textHistory, request.content());
        log.info("Generated assistant reply in {} ms for session {}", System.currentTimeMillis() - started, sessionId);

        ChatMessage assistantMessage = new ChatMessage();
        assistantMessage.setSession(session);
        assistantMessage.setRole(ChatRole.ASSISTANT);
        assistantMessage.setContent(assistantText);
        assistantMessage = chatMessageRepository.save(assistantMessage);

        return new SendMessageResponse(
                session.getId(),
                toResponse(userMessage),
                toResponse(assistantMessage)
        );
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(User owner, Long sessionId) {
        ChatSession session = chatSessionRepository.findByIdAndOwner(sessionId, owner)
                .orElseThrow(() -> new NotFoundException("Chat session not found"));

        return chatMessageRepository.findBySessionOrderByCreatedAtAsc(session)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        return new ChatMessageResponse(message.getId(), message.getRole().name().toLowerCase(), message.getContent(), message.getCreatedAt());
    }

    private String composeSystemPrompt(CharacterCard card) {
        return "You are role-playing as " + card.getName() + ". description=" + card.getDescription() +
                "; personality=" + card.getPersonality() + "; scenario=" + card.getScenario() +
                "; systemPrompt=" + (card.getSystemPrompt() == null ? "" : card.getSystemPrompt());
    }
}
