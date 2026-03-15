package com.focusroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "chatMessages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    private String id;

    private String roomId;

    private String userId;

    private String userName;

    private String message;

    private MessageType type = MessageType.MESSAGE;

    @CreatedDate
    private Date timestamp;

    public enum MessageType {
        MESSAGE,
        SYSTEM,
        STUDY_START,
        STUDY_END,
        HAND_RAISE
    }

    public ChatMessage(String roomId, String userId, String userName, String message) {
        this.roomId = roomId;
        this.userId = userId;
        this.userName = userName;
        this.message = message;
        this.type = MessageType.MESSAGE;
        this.timestamp = new Date();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
