package com.focusroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "studySessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudySession {

    @Id
    private String sessionId;

    private String userId;

    private String roomId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long focusDuration; // in minutes

    private SessionStatus status;

    public enum SessionStatus {
        ACTIVE,
        PAUSED,
        COMPLETED,
        BREAK
    }

    public StudySession(String userId, String roomId, LocalDateTime startTime) {
        this.userId = userId;
        this.roomId = roomId;
        this.startTime = startTime;
        this.status = SessionStatus.ACTIVE;
        this.focusDuration = 0L;
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Long getFocusDuration() {
        return focusDuration;
    }

    public void setFocusDuration(Long focusDuration) {
        this.focusDuration = focusDuration;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }
}
