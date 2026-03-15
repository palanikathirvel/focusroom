package com.focusroom.repository;

import com.focusroom.model.RoomLeaderboard;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RoomLeaderboardRepository extends MongoRepository<RoomLeaderboard, String> {
    List<RoomLeaderboard> findByRoomIdOrderByTotalFocusTimeDesc(String roomId);
    Optional<RoomLeaderboard> findByRoomIdAndUserId(String roomId, String userId);
    void deleteByRoomId(String roomId);
}
