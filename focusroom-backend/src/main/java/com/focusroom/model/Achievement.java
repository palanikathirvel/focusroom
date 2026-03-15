package com.focusroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "achievements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {

    @Id
    private String id;

    private String userId;

    private List<String> unlockedAchievements = new ArrayList<>();

    private LocalDateTime createdAt;

    public Achievement(String userId) {
        this.userId = userId;
        this.unlockedAchievements = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public List<String> getUnlockedAchievements() { return unlockedAchievements; }
    public void setUnlockedAchievements(List<String> unlockedAchievements) { this.unlockedAchievements = unlockedAchievements; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
