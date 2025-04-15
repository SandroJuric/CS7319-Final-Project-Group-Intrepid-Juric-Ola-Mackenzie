package com.cs7319.chat.chatengine.broker;

import com.cs7319.chat.chatengine.domain.ChatEngineUser;
import com.cs7319.chat.chatengine.domain.SubscribedQueue;
import org.springframework.amqp.rabbit.connection.RabbitAccessor;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

public class BrokerAdmin implements BrokerManager{
    @Autowired
    RabbitAdmin rabbitAdmin;
    @Autowired
    RabbitTemplate rabbitAccessor;


    @Override
    public SubscribedQueue createQueue(ChatEngineUser from, ChatEngineUser to) {
        return null;
    }
}
