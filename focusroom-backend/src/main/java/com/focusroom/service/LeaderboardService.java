package com.focusroom.service;

import com.focusroom.model.User;
import com.focusroom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getLeaderboard() {
        List<User> users = userRepository.findAll();

        // Sort by totalFocusTime in descending order
        users.sort(Comparator.comparing(User::getTotalFocusTime).reversed());

        // Assign ranks
        for (int i = 0; i < users.size(); i++) {
            users.get(i).setRank(i + 1);
        }

        return users;
    }

    public Map<String, Object> getUserRank(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> allUsers = userRepository.findAll();
        allUsers.sort(Comparator.comparing(User::getTotalFocusTime).reversed());

        int rank = -1;
        for (int i = 0; i < allUsers.size(); i++) {
            if (allUsers.get(i).getUserId().equals(userId)) {
                rank = i + 1;
                break;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getUserId());
        response.put("name", user.getName());
        response.put("totalFocusTime", user.getTotalFocusTime());
        response.put("rank", rank);
        response.put("totalUsers", allUsers.size());

        return response;
    }

    public List<User> getTopUsers(int limit) {
        List<User> leaderboard = getLeaderboard();
        return leaderboard.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
}
