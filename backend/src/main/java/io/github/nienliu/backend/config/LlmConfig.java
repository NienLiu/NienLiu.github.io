package io.github.nienliu.backend.config;

import io.github.nienliu.backend.llm.LLMProvider;
import io.github.nienliu.backend.llm.MockLLMProvider;
import io.github.nienliu.backend.llm.OpenAICompatibleLLMProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(LlmProperties.class)
public class LlmConfig {

    private static final Logger log = LoggerFactory.getLogger(LlmConfig.class);

    @Bean
    public LLMProvider llmProvider(LlmProperties properties, MockLLMProvider mockLLMProvider) {
        if ("openai".equalsIgnoreCase(properties.getMode())) {
            if (isBlank(properties.getBaseUrl()) || isBlank(properties.getApiKey())) {
                log.warn("llm.mode=openai but llm.base-url or llm.api-key is missing, fallback to mock provider");
                return mockLLMProvider;
            }
            RestClient client = RestClient.builder()
                    .baseUrl(properties.getBaseUrl())
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey())
                    .build();
            return new OpenAICompatibleLLMProvider(client, properties.getModel());
        }
        return mockLLMProvider;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
