package com.cs7319.chat.chatengine.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
//@EnableWebSocketMessageBroker
//@EnableWebSocket
public class ChatEngineConfig {



   /* @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/cs7319").withSockJS();
    }
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/chatengine");
        registry.enableStompBrokerRelay("/topic")
                .setRelayHost("localhost").setRelayPort(61613).setClientLogin("cs7319")
                .setClientPasscode("7319_pwd");
       // registry.enableSimpleBroker("/topic");
       // registry.setApplicationDestinationPrefixes("/app");
    }*/
    //guest,guest



}
