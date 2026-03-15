package com.focusroom.controller;

import com.focusroom.model.ChatMessage;
import com.focusroom.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Get chat history for a room
    @GetMapping("/{roomId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String roomId) {
        List<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderByTimestampAsc(roomId);
        return ResponseEntity.ok(messages);
    }

    // Send a message (REST API - also broadcasts via WebSocket)
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        // Save message to database
        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Broadcast to all subscribers via WebSocket
        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomId(), savedMessage);

        return ResponseEntity.ok(savedMessage);
    }

    // Delete a message
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Map<String, Object>> deleteMessage(@PathVariable String messageId) {
        try {
            chatMessageRepository.deleteById(messageId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messageId", messageId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
