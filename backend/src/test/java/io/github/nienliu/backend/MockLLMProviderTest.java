package io.github.nienliu.backend;

import io.github.nienliu.backend.entity.CharacterCard;
import io.github.nienliu.backend.llm.MockLLMProvider;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

class MockLLMProviderTest {

    @Test
    void shouldContainCharacterDataInReply() {
        CharacterCard card = new CharacterCard();
        card.setName("测试角色");
        card.setPersonality("开朗");
        card.setScenario("教室");

        String reply = new MockLLMProvider().generateReply(card, List.of(), "你好");

        assertTrue(reply.contains("测试角色"));
        assertTrue(reply.contains("开朗"));
        assertTrue(reply.contains("你好"));
    }
}
