package com.focusroom.repository;

import com.focusroom.model.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AchievementRepository extends MongoRepository<Achievement, String> {
    Optional<Achievement> findByUserId(String userId);
}
