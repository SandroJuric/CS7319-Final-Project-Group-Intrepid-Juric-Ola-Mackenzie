package com.cs7319.chat.chatengine.controller;

import com.cs7319.chat.chatengine.domain.ChatEngineUser;
import com.cs7319.chat.chatengine.domain.ChatHistory;
import com.cs7319.chat.chatengine.domain.OnlineUsers;
import com.cs7319.chat.chatengine.domain.SubscribedQueue;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

public interface ChatController {


    public SubscribedQueue requestChatSession(String from, String To);

    public List<ChatHistory> showChatHistory(String queueId);
    public List<OnlineUsers> requestConnectedUsers();
    public void registerUser(OnlineUsers user);
}
