package io.github.nienliu.backend.llm;

import io.github.nienliu.backend.entity.CharacterCard;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MockLLMProvider implements LLMProvider {

    @Override
    public String generateReply(CharacterCard card, List<String> history, String userInput) {
        String historyHint = history.isEmpty() ? "这是我们的第一轮对话。" : "我会延续刚刚的语境继续回应。";
        return "【模拟回复】角色【%s】(性格:%s, 场景:%s)：%s 你刚才说的是“%s”。".formatted(
                card.getName(),
                card.getPersonality(),
                card.getScenario(),
                historyHint,
                userInput
        );
    }
}
