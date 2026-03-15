package com.focusroom.service;

import com.focusroom.model.RoomLeaderboard;
import com.focusroom.model.RoomMember;
import com.focusroom.model.StudySession;
import com.focusroom.model.User;
import com.focusroom.repository.RoomLeaderboardRepository;
import com.focusroom.repository.RoomMemberRepository;
import com.focusroom.repository.SessionRepository;
import com.focusroom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomMemberRepository roomMemberRepository;

    @Autowired
    private RoomLeaderboardRepository roomLeaderboardRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public StudySession startSession(String userId, String roomId) {
        // Check if user already has an active session
        Optional<StudySession> existingSession = sessionRepository.findByUserIdAndStatus(userId,
                StudySession.SessionStatus.ACTIVE);

        if (existingSession.isPresent()) {
            throw new RuntimeException("User already has an active session");
        }

        StudySession session = new StudySession(userId, roomId, LocalDateTime.now());
        StudySession savedSession = sessionRepository.save(session);

        // Update RoomMember status
        updateRoomMemberStatus(roomId, userId, RoomMember.MemberStatus.STUDYING);

        return savedSession;
    }

    @Transactional
    public StudySession endSession(String sessionId) {
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        LocalDateTime endTime = LocalDateTime.now();
        long durationInMinutes = java.time.Duration.between(session.getStartTime(), endTime).toMinutes();

        session.setEndTime(endTime);
        session.setFocusDuration(durationInMinutes);
        session.setStatus(StudySession.SessionStatus.COMPLETED);

        StudySession savedSession = sessionRepository.save(session);

        // Update user's total focus time (Global)
        User user = userRepository.findById(session.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTotalFocusTime(user.getTotalFocusTime() + durationInMinutes);
        userRepository.save(user);

        // Update RoomMember status and focus time
        updateRoomMemberStatus(session.getRoomId(), session.getUserId(), RoomMember.MemberStatus.CANCELLED, durationInMinutes);

        // Update RoomLeaderboard
        updateRoomLeaderboard(session.getRoomId(), session.getUserId(), user.getName(), durationInMinutes);

        return savedSession;
    }

    @Transactional
    public StudySession pauseSession(String sessionId) {
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(StudySession.SessionStatus.PAUSED);
        StudySession savedSession = sessionRepository.save(session);

        // Update RoomMember status
        updateRoomMemberStatus(session.getRoomId(), session.getUserId(), RoomMember.MemberStatus.PAUSED);

        return savedSession;
    }

    @Transactional
    public StudySession resumeSession(String sessionId) {
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(StudySession.SessionStatus.ACTIVE);
        StudySession savedSession = sessionRepository.save(session);

        // Update RoomMember status
        updateRoomMemberStatus(session.getRoomId(), session.getUserId(), RoomMember.MemberStatus.STUDYING);

        return savedSession;
    }

    private void updateRoomMemberStatus(String roomId, String userId, RoomMember.MemberStatus status) {
        updateRoomMemberStatus(roomId, userId, status, 0L);
    }

    private void updateRoomMemberStatus(String roomId, String userId, RoomMember.MemberStatus status, Long addedFocusTime) {
        roomMemberRepository.findByRoomIdAndUserId(roomId, userId).ifPresent(member -> {
            member.setStatus(status);
            member.setFocusTime(member.getFocusTime() + addedFocusTime);
            roomMemberRepository.save(member);
            
            // Broadcast member update via WebSocket
            messagingTemplate.convertAndSend("/topic/room/" + roomId + "/members", member);
        });
    }

    private void updateRoomLeaderboard(String roomId, String userId, String userName, Long addedFocusTime) {
        RoomLeaderboard entry = roomLeaderboardRepository.findByRoomIdAndUserId(roomId, userId)
                .orElse(new RoomLeaderboard(roomId, userId, userName));
        
        entry.setTotalFocusTime(entry.getTotalFocusTime() + addedFocusTime);
        roomLeaderboardRepository.save(entry);
        
        // Broadcast leaderboard update via WebSocket
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/leaderboard", "updated");
    }

    public Optional<StudySession> getActiveSession(String userId) {
        return sessionRepository.findByUserIdAndStatus(userId, StudySession.SessionStatus.ACTIVE);
    }

    public List<StudySession> getUserSessions(String userId) {
        return sessionRepository.findByUserId(userId);
    }

    public List<StudySession> getRoomActiveSessions(String roomId) {
        return sessionRepository.findByRoomIdAndStatus(roomId, StudySession.SessionStatus.ACTIVE);
    }
}
