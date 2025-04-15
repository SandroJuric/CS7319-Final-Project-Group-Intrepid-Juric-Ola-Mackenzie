package com.cs7319.chat.chatengine.services;

import com.cs7319.chat.chatengine.domain.ChatPairing;
import com.cs7319.chat.chatengine.repo.ChatPairingRepo;
import com.cs7319.chat.chatengine.utils.ChatParingUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PairingChecker {

    @Autowired
    protected ChatPairingRepo pairingRepo;

    public ChatPairing checkQueueExists(String user1, String user2) {


        String[] normalizedPair = ChatParingUtils.pairUsers(user1, user2);

        String userA = normalizedPair[0];  // "alice"
        String userB = normalizedPair[1];  // "bob"

        Optional<ChatPairing> pairing = (pairingRepo.findPairingUnordered(userA, userB));


        if (pairing.isPresent()) {
            ChatPairing found = pairing.get();
            System.out.println("Existing queue: " + found.getQueueId());
            return found;
        } else {
            System.out.println("No chat yet, create queue.");
        }
          return null;
    }

}
