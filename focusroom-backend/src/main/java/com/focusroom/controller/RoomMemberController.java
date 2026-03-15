package com.focusroom.controller;

import com.focusroom.model.RoomMember;
import com.focusroom.repository.RoomMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomMemberController {

    @Autowired
    private RoomMemberRepository roomMemberRepository;

    @GetMapping("/{roomId}/members")
    public ResponseEntity<List<RoomMember>> getRoomMembers(@PathVariable String roomId) {
        return ResponseEntity.ok(roomMemberRepository.findByRoomId(roomId));
    }
}
