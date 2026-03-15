package com.focusroom.service;

import com.focusroom.model.RoomMember;
import com.focusroom.model.StudyRoom;
import com.focusroom.model.User;
import com.focusroom.repository.RoomMemberRepository;
import com.focusroom.repository.RoomRepository;
import com.focusroom.repository.UserRepository;
import com.focusroom.repository.ChatMessageRepository;
import com.focusroom.repository.RoomLeaderboardRepository;
import com.focusroom.repository.RoomNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMemberRepository roomMemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private RoomLeaderboardRepository roomLeaderboardRepository;

    @Autowired
    private RoomNoteRepository roomNoteRepository;

    @Autowired
    @Lazy
    private SessionService sessionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public StudyRoom createRoom(String roomName, String createdBy, Integer maxMembers, Integer focusDuration, Integer breakDuration) {
        StudyRoom room = new StudyRoom(roomName, createdBy);
        if (maxMembers != null) {
            room.setMaxMembers(maxMembers);
        }
        if (focusDuration != null) {
            room.setFocusDuration(focusDuration);
        }
        if (breakDuration != null) {
            room.setBreakDuration(breakDuration);
        }
        return roomRepository.save(room);
    }

    public List<StudyRoom> getAllRooms() {
        return roomRepository.findAllByOrderByCreatedAtDesc();
    }

    public StudyRoom getRoomById(String roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
    }

    @Transactional
    public StudyRoom joinRoom(String roomId, String userId) {
        StudyRoom room = getRoomById(roomId);

        if (room.getMembers().contains(userId)) {
            throw new RuntimeException("User already in this room");
        }

        if (room.getMembers().size() >= room.getMaxMembers()) {
            throw new RuntimeException("Room is full");
        }

        room.getMembers().add(userId);
        
        // Create RoomMember record
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RoomMember roomMember = new RoomMember(roomId, userId, user.getName());
        roomMemberRepository.save(roomMember);

        return roomRepository.save(room);
    }

    @Transactional
    public StudyRoom leaveRoom(String roomId, String userId) {
        StudyRoom room = getRoomById(roomId);

        if (!room.getMembers().contains(userId)) {
            throw new RuntimeException("User not in this room");
        }

        room.getMembers().remove(userId);
        
        // Remove RoomMember record
        roomMemberRepository.deleteByRoomIdAndUserId(roomId, userId);

        // Auto-end any active or paused sessions for this user
        sessionService.getActiveSession(userId).ifPresent(session -> {
            if (session.getRoomId().equals(roomId)) {
                try {
                    sessionService.endSession(session.getSessionId());
                } catch (Exception e) {}
            }
        });

        return roomRepository.save(room);
    }

    public boolean isMember(String roomId, String userId) {
        StudyRoom room = getRoomById(roomId);
        return room.getMembers().contains(userId);
    }

    @Transactional
    public void deleteRoom(String roomId, String userId) {
        StudyRoom room = getRoomById(roomId);

        if (!room.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Only the room creator can delete the room");
        }

        // Cascade delete related records
        roomMemberRepository.deleteByRoomId(roomId);
        chatMessageRepository.deleteByRoomId(roomId);
        roomLeaderboardRepository.deleteByRoomId(roomId);
        roomNoteRepository.deleteByRoomId(roomId);

        // Delete the room itself
        roomRepository.deleteById(roomId);

        // Notify clients to exit the room
        java.util.Map<String, Object> event = new java.util.HashMap<>();
        event.put("type", "ROOM_DELETED");
        messagingTemplate.convertAndSend("/topic/room/" + roomId, event);
    }
}
