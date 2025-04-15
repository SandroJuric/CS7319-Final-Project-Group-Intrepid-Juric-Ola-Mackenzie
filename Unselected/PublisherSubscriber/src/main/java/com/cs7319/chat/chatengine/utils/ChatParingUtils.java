package com.cs7319.chat.chatengine.utils;

public class ChatParingUtils {

        public static String[] pairUsers(String user1, String user2) {
            if (user1.compareTo(user2) < 0) {
                return new String[]{user1, user2};
            } else {
                return new String[]{user2, user1};
            }
        }


}
