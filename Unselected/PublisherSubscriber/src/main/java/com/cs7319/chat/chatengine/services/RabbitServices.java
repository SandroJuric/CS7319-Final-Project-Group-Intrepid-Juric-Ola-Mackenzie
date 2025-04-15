package com.cs7319.chat.chatengine.services;

import com.cs7319.chat.chatengine.domain.ChatRequest;
import com.cs7319.chat.chatengine.domain.SubscribedQueue;

public interface RabbitServices {

    public SubscribedQueue addChatQueue(ChatRequest request);
    public SubscribedQueue addStreamChatQueue(ChatRequest request);
}
