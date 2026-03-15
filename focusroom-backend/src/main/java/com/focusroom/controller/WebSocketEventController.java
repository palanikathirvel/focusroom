package com.focusroom.controller;

import com.focusroom.model.ChatMessage;
import com.focusroom.model.StudySession;
import com.focusroom.repository.ChatMessageRepository;
import com.focusroom.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
public class WebSocketEventController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @MessageMapping("/study.start")
    public void handleStudyStart(@Payload Map<String, String> payload) {
        String userId = payload.get("userId");
        String roomId = payload.get("roomId");

        Map<String, Object> event = new HashMap<>();
        event.put("type", "SESSION_STARTED");
        event.put("userId", userId);
        event.put("roomId", roomId);
        event.put("startTime", LocalDateTime.now());

        messagingTemplate.convertAndSend("/topic/room/" + roomId, event);
    }

    @MessageMapping("/study.end")
    public void handleStudyEnd(@Payload Map<String, String> payload) {
        String sessionId = payload.get("sessionId");
        String roomId = payload.get("roomId");

        StudySession session = sessionService.endSession(sessionId);

        Map<String, Object> event = new HashMap<>();
        event.put("type", "SESSION_ENDED");
        event.put("userId", session.getUserId());
        event.put("focusDuration", session.getFocusDuration());
        event.put("endTime", session.getEndTime());

        messagingTemplate.convertAndSend("/topic/room/" + roomId, event);
    }

    @MessageMapping("/study.pause")
    public void handleStudyPause(@Payload Map<String, String> payload) {
        String sessionId = payload.get("sessionId");
        String roomId = payload.get("roomId");

        StudySession session = sessionService.pauseSession(sessionId);

        Map<String, Object> event = new HashMap<>();
        event.put("type", "SESSION_PAUSED");
        event.put("userId", session.getUserId());
        event.put("status", "PAUSED");

        messagingTemplate.convertAndSend("/topic/room/" + roomId, event);
    }

    @MessageMapping("/study.resume")
    public void handleStudyResume(@Payload Map<String, String> payload) {
        String sessionId = payload.get("sessionId");
        String roomId = payload.get("roomId");

        StudySession session = sessionService.resumeSession(sessionId);

        Map<String, Object> event = new HashMap<>();
        event.put("type", "SESSION_RESUMED");
        event.put("userId", session.getUserId());
        event.put("status", "ACTIVE");

        messagingTemplate.convertAndSend("/topic/room/" + roomId, event);
    }

    @MessageMapping("/user.status")
    public void handleUserStatus(@DestinationVariable String roomId, @Payload Map<String, String> payload) {
        String userId = payload.get("userId");
        String status = payload.get("status"); // STUDYING, BREAK, OFFLINE

        Map<String, Object> event = new HashMap<>();
        event.put("type", "USER_STATUS_CHANGED");
        event.put("userId", userId);
        event.put("status", status);

        messagingTemplate.convertAndSend("/topic/room/" + roomId, event);
    }

    @MessageMapping("/chat.sendMessage")
    public void handleChatMessage(@Payload ChatMessage message) {
        // Save message to database
        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Broadcast to all subscribers in the room
        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomId(), savedMessage);
    }
}
