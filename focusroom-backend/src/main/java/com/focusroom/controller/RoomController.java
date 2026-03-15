package com.focusroom.controller;

import com.focusroom.dto.CreateRoomRequest;
import com.focusroom.model.StudyRoom;
import com.focusroom.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public ResponseEntity<List<StudyRoom>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<StudyRoom> getRoomById(@PathVariable String roomId) {
        return ResponseEntity.ok(roomService.getRoomById(roomId));
    }

    @PostMapping("/create")
    public ResponseEntity<StudyRoom> createRoom(@RequestBody CreateRoomRequest request,
            @RequestHeader("X-User-Id") String createdBy) {
        StudyRoom room = roomService.createRoom(
            request.getRoomName(), 
            createdBy, 
            request.getMaxMembers(),
            request.getFocusDuration(),
            request.getBreakDuration()
        );
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<StudyRoom> joinRoom(@PathVariable String roomId, @RequestHeader("X-User-Id") String userId) {
        StudyRoom room = roomService.joinRoom(roomId, userId);
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{roomId}/leave")
    public ResponseEntity<StudyRoom> leaveRoom(@PathVariable String roomId, @RequestHeader("X-User-Id") String userId) {
        StudyRoom room = roomService.leaveRoom(roomId, userId);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomId}/check-member")
    public ResponseEntity<Map<String, Boolean>> checkMember(@PathVariable String roomId,
            @RequestHeader("X-User-Id") String userId) {
        boolean isMember = roomService.isMember(roomId, userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isMember", isMember);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Map<String, String>> deleteRoom(@PathVariable String roomId, @RequestHeader("X-User-Id") String userId) {
        roomService.deleteRoom(roomId, userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room deleted successfully");
        return ResponseEntity.ok(response);
    }
}
