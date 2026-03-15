package com.focusroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "userProgress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    private String id;

    private String userId;

    private Integer level = 1;

    private Integer experiencePoints = 0;

    private Integer nextLevelXp = 100;

    private Integer totalXpEarned = 0;

    private Integer dayStreak = 0;

    private LocalDateTime lastStudyDate;

    private LocalDateTime createdAt;

    public UserProgress(String userId) {
        this.userId = userId;
        this.level = 1;
        this.experiencePoints = 0;
        this.nextLevelXp = 100;
        this.dayStreak = 0;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public Integer getExperiencePoints() { return experiencePoints; }
    public void setExperiencePoints(Integer experiencePoints) { this.experiencePoints = experiencePoints; }
    public Integer getNextLevelXp() { return nextLevelXp; }
    public void setNextLevelXp(Integer nextLevelXp) { this.nextLevelXp = nextLevelXp; }
    public Integer getTotalXpEarned() { return totalXpEarned; }
    public void setTotalXpEarned(Integer totalXpEarned) { this.totalXpEarned = totalXpEarned; }
    public Integer getDayStreak() { return dayStreak; }
    public void setDayStreak(Integer dayStreak) { this.dayStreak = dayStreak; }
    public LocalDateTime getLastStudyDate() { return lastStudyDate; }
    public void setLastStudyDate(LocalDateTime lastStudyDate) { this.lastStudyDate = lastStudyDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
