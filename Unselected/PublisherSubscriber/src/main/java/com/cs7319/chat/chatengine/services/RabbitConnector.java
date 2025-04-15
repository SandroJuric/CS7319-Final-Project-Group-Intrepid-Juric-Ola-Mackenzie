package com.cs7319.chat.chatengine.services;

import com.cs7319.chat.chatengine.domain.ChatPairing;
import com.cs7319.chat.chatengine.domain.ChatRequest;
import com.cs7319.chat.chatengine.domain.SubscribedQueue;
import com.cs7319.chat.chatengine.repo.ChatPairingRepo;
import com.rabbitmq.client.AMQP;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;

@Service
public class RabbitConnector implements RabbitServices{

    @Autowired
    RabbitAdmin rabbitAdmin;
    @Autowired
    protected ChatPairingRepo pairingRepo;
    @Autowired
    PairingChecker checker;
    @Override
    public SubscribedQueue addChatQueue(ChatRequest request) {
        Instant timestamp = Instant.now();
        SubscribedQueue subscribedQueue = new SubscribedQueue();
        String timestampString = timestamp.toString();
        String username = request.getFromUserName();
        String queueId = username + timestampString;
        subscribedQueue.setQueueId(username + timestampString);
        subscribedQueue.setRequestingser(request.getFromUserName());
        subscribedQueue.setRequestedUser(request.getToUserName());
        Queue queue  = new Queue(queueId);

        String response = rabbitAdmin.declareQueue(queue);
        System.out.println("RabbitMQ Response:   " + response);

        //  subscribedQueue.setQueueId(UUID.randomUUID().toString());
        return subscribedQueue;
    }

    @Override
    public SubscribedQueue addStreamChatQueue(ChatRequest request) {

        Instant timestamp = Instant.now();
        SubscribedQueue subscribedQueue;
        subscribedQueue = new SubscribedQueue();
        //check if in DB
        String timestampString = timestamp.toString();
        String username = request.getFromUserName();
        String queueId = username + timestampString;
        ChatPairing chatPairing = checker.checkQueueExists(request.getFromUserName(), request.getToUserName());
          if(chatPairing != null){
              subscribedQueue.setQueueId(chatPairing.getQueueId());
              subscribedQueue.setRequestingser(request.getFromUserName());
              subscribedQueue.setRequestedUser(request.getToUserName());
              return subscribedQueue;
          }
        subscribedQueue.setQueueId(username + timestampString);
        subscribedQueue.setRequestingser(request.getFromUserName());
        subscribedQueue.setRequestedUser(request.getToUserName());

        /*Queue queue = QueueBuilder.durable(queueId)
                .stream()
                .build();*/
        Queue streamQueue = QueueBuilder
                .durable(queueId)
                .stream()
                .withArgument("x-max-length-bytes", 1_000_000_000L) // 10 GB
                .withArgument("x-stream-max-segment-size-bytes", 100_000_000) // optional
                .build();

        //.withArgument("x-queue-type", "stream")
        String response = rabbitAdmin.declareQueue(streamQueue);
        subscribedQueue.setQueueId(response);
        ChatPairing newPair = new ChatPairing(subscribedQueue.getRequestingser(),subscribedQueue.getRequestedUser(),
                              subscribedQueue.getQueueId(), new Date());
        ChatPairing pairing = pairingRepo.save(newPair);
        System.out.println("RabbitMQ Response:   " + response);



        return subscribedQueue;
    }

    public void createStreamQueue(String name) {
        Queue streamQueue = QueueBuilder
                .durable(name)
                .withArgument("x-queue-type", "stream")  //THIS IS THE KEY
                .withArgument("x-max-length-bytes", 1_000_000_000L) // 10 GB
                .withArgument("x-stream-max-segment-size-bytes", 100_000_000) // optional
                .build();

        rabbitAdmin.declareQueue(streamQueue);
    }


}
