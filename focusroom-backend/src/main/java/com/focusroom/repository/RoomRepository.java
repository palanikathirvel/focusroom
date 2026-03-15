package com.focusroom.repository;

import com.focusroom.model.StudyRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<StudyRoom, String> {
    List<StudyRoom> findAllByOrderByCreatedAtDesc();
}
