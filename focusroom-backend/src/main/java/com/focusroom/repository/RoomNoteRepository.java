package com.focusroom.repository;

import com.focusroom.model.RoomNote;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RoomNoteRepository extends MongoRepository<RoomNote, String> {
    List<RoomNote> findByRoomIdOrderByUploadedAtDesc(String roomId);
    void deleteByRoomId(String roomId);
}
