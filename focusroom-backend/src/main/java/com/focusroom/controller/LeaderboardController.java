package com.focusroom.controller;

import com.focusroom.model.RoomLeaderboard;
import com.focusroom.model.User;
import com.focusroom.repository.RoomLeaderboardRepository;
import com.focusroom.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @Autowired
    private RoomLeaderboardRepository roomLeaderboardRepository;

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<RoomLeaderboard>> getRoomLeaderboard(@PathVariable String roomId) {
        return ResponseEntity.ok(roomLeaderboardRepository.findByRoomIdOrderByTotalFocusTimeDesc(roomId));
    }

    @GetMapping
    public ResponseEntity<List<User>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserRank(@PathVariable String userId) {
        return ResponseEntity.ok(leaderboardService.getUserRank(userId));
    }

    @GetMapping("/top/{limit}")
    public ResponseEntity<List<User>> getTopUsers(@PathVariable int limit) {
        return ResponseEntity.ok(leaderboardService.getTopUsers(limit));
    }
}
