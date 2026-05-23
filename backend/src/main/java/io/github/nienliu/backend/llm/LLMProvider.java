package io.github.nienliu.backend.llm;

import io.github.nienliu.backend.entity.CharacterCard;

import java.util.List;

public interface LLMProvider {
    String generateReply(CharacterCard card, List<String> history, String userInput);
}
