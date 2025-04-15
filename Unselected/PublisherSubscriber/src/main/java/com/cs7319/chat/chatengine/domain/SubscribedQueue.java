package com.cs7319.chat.chatengine.domain;

public class SubscribedQueue {

    private Long id;
    private String queueId;
    private String requestingser;
    private String requestedUser;

    public String getRequestingser() {
        return requestingser;
    }

    public void setRequestingser(String requestingser) {
        this.requestingser = requestingser;
    }

    public String getRequestedUser() {
        return requestedUser;
    }

    public void setRequestedUser(String requestedUser) {
        this.requestedUser = requestedUser;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQueueId() {
        return queueId;
    }

    public void setQueueId(String queueId) {
        this.queueId = queueId;
    }
}
