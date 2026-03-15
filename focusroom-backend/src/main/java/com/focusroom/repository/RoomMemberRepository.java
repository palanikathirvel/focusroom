package com.focusroom.repository;

import com.focusroom.model.RoomMember;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RoomMemberRepository extends MongoRepository<RoomMember, String> {
    List<RoomMember> findByRoomId(String roomId);
    Optional<RoomMember> findByRoomIdAndUserId(String roomId, String userId);
    void deleteByRoomIdAndUserId(String roomId, String userId);
    void deleteByRoomId(String roomId);
}
