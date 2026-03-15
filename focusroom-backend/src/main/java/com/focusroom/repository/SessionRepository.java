package com.focusroom.repository;

import com.focusroom.model.StudySession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends MongoRepository<StudySession, String> {
    List<StudySession> findByUserId(String userId);

    Optional<StudySession> findByUserIdAndStatus(String userId, StudySession.SessionStatus status);

    List<StudySession> findByRoomIdAndStatus(String roomId, StudySession.SessionStatus status);
}
