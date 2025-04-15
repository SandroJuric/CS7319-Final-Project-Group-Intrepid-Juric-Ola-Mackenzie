package com.cs7319.chat.chatengine.domain;

import java.time.Instant;
import java.util.Objects;

public class OnlineUsers {

    private Long id;
    private String userName;
    private String chatRequestsQueue;
    private Instant connected;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChatRequestsQueue() {
        return chatRequestsQueue;
    }

    public void setChatRequestsQueue(String chatRequestsQueue) {
        this.chatRequestsQueue = chatRequestsQueue;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Instant getConnected() {
        return connected;
    }

    public void setConnected(Instant connected) {
        this.connected = connected;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OnlineUsers that)) return false;
        return Objects.equals(getUserName(), that.getUserName()) && Objects.equals(getConnected(), that.getConnected());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getUserName(), getConnected());
    }
}
