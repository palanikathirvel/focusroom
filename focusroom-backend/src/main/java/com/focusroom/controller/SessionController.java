package com.focusroom.controller;

import com.focusroom.dto.StartSessionRequest;
import com.focusroom.model.StudySession;
import com.focusroom.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/session")
@CrossOrigin(origins = "*")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startSession(@RequestBody StartSessionRequest request,
            @RequestHeader("X-User-Id") String userId) {
        StudySession session = sessionService.startSession(userId, request.getRoomId());

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getSessionId());
        response.put("startTime", session.getStartTime());
        response.put("status", session.getStatus());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<Map<String, Object>> endSession(@PathVariable String sessionId) {
        StudySession session = sessionService.endSession(sessionId);

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getSessionId());
        response.put("focusDuration", session.getFocusDuration());
        response.put("endTime", session.getEndTime());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/pause")
    public ResponseEntity<StudySession> pauseSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(sessionService.pauseSession(sessionId));
    }

    @PostMapping("/{sessionId}/resume")
    public ResponseEntity<StudySession> resumeSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(sessionService.resumeSession(sessionId));
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<Map<String, Object>> getActiveSession(@PathVariable String userId) {
        Optional<StudySession> session = sessionService.getActiveSession(userId);

        if (session.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.get().getSessionId());
        response.put("roomId", session.get().getRoomId());
        response.put("startTime", session.get().getStartTime());
        response.put("status", session.get().getStatus());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/history")
    public ResponseEntity<List<StudySession>> getUserSessions(@PathVariable String userId) {
        return ResponseEntity.ok(sessionService.getUserSessions(userId));
    }

    @GetMapping("/room/{roomId}/active")
    public ResponseEntity<List<StudySession>> getRoomActiveSessions(@PathVariable String roomId) {
        return ResponseEntity.ok(sessionService.getRoomActiveSessions(roomId));
    }
}
