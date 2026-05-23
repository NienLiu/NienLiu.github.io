package io.github.nienliu.backend.llm;

import io.github.nienliu.backend.entity.CharacterCard;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OpenAICompatibleLLMProvider implements LLMProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenAICompatibleLLMProvider.class);

    private final RestClient restClient;
    private final String model;

    public OpenAICompatibleLLMProvider(RestClient restClient, String model) {
        this.restClient = restClient;
        this.model = model;
    }

    @Override
    @SuppressWarnings("unchecked")
    public String generateReply(CharacterCard card, List<String> history, String userInput) {
        List<Map<String, String>> messages = new ArrayList<>();
        String system = "你正在扮演角色卡。name=" + card.getName() + ", description=" + card.getDescription() +
                ", personality=" + card.getPersonality() + ", scenario=" + card.getScenario() +
                ", firstMessage=" + card.getFirstMessage() + ", systemPrompt=" + card.getSystemPrompt();
        messages.add(Map.of("role", "system", "content", system));

        for (String line : history) {
            messages.add(Map.of("role", "user", "content", line));
        }
        messages.add(Map.of("role", "user", "content", userInput));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", messages);

        Map<String, Object> response = restClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            return "【兼容接口回复】空响应";
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) {
            log.warn("OpenAI-compatible response missing choices: {}", response);
            return "【兼容接口回复】响应缺少 choices";
        }

        Map<String, Object> firstChoice = choices.get(0);
        Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
        return message == null ? "【兼容接口回复】响应缺少 message" : String.valueOf(message.get("content"));
    }
}
