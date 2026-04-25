package com.betolyn.features.feedsync;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties({FeedSyncProperties.class, FeedShadowProperties.class})
public class FeedSyncRestClientConfig {

    @Bean
    RestClient espnFeedSyncRestClient(FeedSyncProperties props) {
        String base = props.getBaseUrl() == null ? "" : props.getBaseUrl().trim();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        if (base.isEmpty()) {
            base = "http://localhost:8010";
        }
        var requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(props.effectiveHttpConnectTimeout());
        requestFactory.setReadTimeout(props.effectiveHttpReadTimeout());
        return RestClient.builder()
                .baseUrl(base)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .requestFactory(requestFactory)
                .build();
    }
}
