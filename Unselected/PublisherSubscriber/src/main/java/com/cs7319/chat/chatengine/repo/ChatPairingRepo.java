package com.cs7319.chat.chatengine.repo;

import com.cs7319.chat.chatengine.domain.ChatPairing;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;


public interface ChatPairingRepo extends MongoRepository<ChatPairing,String> {


       // public ChatPairing findByUsernames(String userName1,String userName2);

        public List<ChatPairing> findByFromUserNameOrToUserName(String fromUserName,String toUserName);

         default  List<ChatPairing>findByUserName(String username){
               return findByFromUserNameOrToUserName(username,username);
         }

         @Query(value = "{ $or: [ " +
                        "{ $and: [ { 'fromUserName': ?0 }, { 'toUserName': ?1 } ] }, " +
                        "{ $and: [ { 'fromUserName': ?1 }, { 'toUserName': ?0 } ] } " +
                        "] }")
         Optional<ChatPairing> findPairingUnordered(String user1, String user2);

}
