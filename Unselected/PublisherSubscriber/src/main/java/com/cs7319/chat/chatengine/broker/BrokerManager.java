package com.cs7319.chat.chatengine.broker;

import com.cs7319.chat.chatengine.domain.ChatEngineUser;
import com.cs7319.chat.chatengine.domain.SubscribedQueue;

public interface BrokerManager {

    public SubscribedQueue createQueue(ChatEngineUser from, ChatEngineUser to);
}
