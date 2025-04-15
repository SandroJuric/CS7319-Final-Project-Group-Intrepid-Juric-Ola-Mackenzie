package com.cs7319.chat.chatengine.controller;

import com.cs7319.chat.chatengine.domain.*;
import com.cs7319.chat.chatengine.services.RabbitConnector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class ChatEngine implements ChatController{
    private Map<String, String> chatSessions = new ConcurrentHashMap<>(); //Just write to backend
    @Autowired
    RabbitConnector rabbitConnector;
    private List<OnlineUsers> onlineUsersList = new ArrayList<OnlineUsers>();

    //@MessageMapping("/newChatSession")
    //@SendTo("/queue/pendingSessions")
    public ChatEngineMessage requestNewSession(ChatEngineMessage message){

        return null;
    }

    @GetMapping("/newChatRequest")
    @Override
    public SubscribedQueue requestChatSession(String from, String To) {
         ChatRequest chatRequest = new ChatRequest();
         chatRequest.setDate(new Date());
         chatRequest.setFromUserName(from);
         chatRequest.setToUserName(To);
       return rabbitConnector.addChatQueue(chatRequest);

    }

    @PostMapping("/newChatRequest")
    public SubscribedQueue requestChatSession(@RequestBody ChatRequest chatRequest) {
        chatRequest.setDate(new Date()); // server assigns date
        System.out.println(chatRequest.getFromUserName());
        System.out.println(chatRequest.getToUserName());
        return rabbitConnector.addStreamChatQueue(chatRequest);
    }

    public List<OnlineUsers> requestConnectedUsers(){
          return null;
    }

    @Override
    public void registerUser(OnlineUsers user) {

    }




   /* public void startChat(String userA, String userB) {
        String queueName = "chat." + UUID.randomUUID();
        Queue q = new Queue(queueName);
        rabbitAdmin.declareQueue(q);
        chatSessions.put(userA + "_" + userB, queueName);
    }*/


    @Override
    @GetMapping("/getchathistory/{id}")
    public List<ChatHistory> showChatHistory(@PathVariable String queueId) {

        return null;
    }
}
