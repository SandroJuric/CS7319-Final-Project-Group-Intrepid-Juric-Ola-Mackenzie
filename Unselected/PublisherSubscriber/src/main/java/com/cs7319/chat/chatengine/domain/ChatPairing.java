package com.cs7319.chat.chatengine.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "chatpairing")
public class ChatPairing {
    @Id
    private String id;
    private String fromUserName;
    private String toUserName;
    private String queueId;
    private Date date;

    public ChatPairing(String fromUserName, String toUserName, String queueId, Date date) {
        this.fromUserName = fromUserName;
        this.toUserName = toUserName;
        this.queueId = queueId;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getFromUserName() {
        return fromUserName;
    }

    public void setFromUserName(String fromUserName) {
        this.fromUserName = fromUserName;
    }

    public String getToUserName() {
        return toUserName;
    }

    public void setToUserName(String toUserName) {
        this.toUserName = toUserName;
    }

    public String getQueueId() {
        return queueId;
    }

    public void setQueueId(String queueId) {
        this.queueId = queueId;
    }
}
