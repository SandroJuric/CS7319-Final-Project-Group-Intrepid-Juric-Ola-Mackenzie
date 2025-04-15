package com.cs7319.chat.chatengine.config;

import com.cs7319.chat.chatengine.domain.ChatEngineUser;
import com.cs7319.chat.chatengine.domain.SubscribedQueue;

public interface DynamicBeanCreator {

    public SubscribedQueue createChatQueue(ChatEngineUser userFrom,ChatEngineUser userTo);
}
