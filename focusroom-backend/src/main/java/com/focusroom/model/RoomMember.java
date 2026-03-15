package com.focusroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "roomMembers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomMember {

    @Id
    private String id;
    private String roomId;
    private String userId;
    private String userName;
    private MemberStatus status;
    private Long focusTime; // total focus time in minutes for this room
    private LocalDateTime joinedAt;

    public enum MemberStatus {
        STUDYING,
        BREAK,
        PAUSED,
        CANCELLED
    }

    public RoomMember(String roomId, String userId, String userName) {
        this.roomId = roomId;
        this.userId = userId;
        this.userName = userName;
        this.status = MemberStatus.CANCELLED; // Default status
        this.focusTime = 0L;
        this.joinedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public MemberStatus getStatus() {
        return status;
    }

    public void setStatus(MemberStatus status) {
        this.status = status;
    }

    public Long getFocusTime() {
        return focusTime;
    }

    public void setFocusTime(Long focusTime) {
        this.focusTime = focusTime;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
