package com.focusroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "roomLeaderboard")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomLeaderboard {

    @Id
    private String id;
    private String roomId;
    private String userId;
    private String userName;
    private Long totalFocusTime;

    public RoomLeaderboard(String roomId, String userId, String userName) {
        this.roomId = roomId;
        this.userId = userId;
        this.userName = userName;
        this.totalFocusTime = 0L;
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

    public Long getTotalFocusTime() {
        return totalFocusTime;
    }

    public void setTotalFocusTime(Long totalFocusTime) {
        this.totalFocusTime = totalFocusTime;
    }
}
