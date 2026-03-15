package com.focusroom.controller;

import com.focusroom.model.RoomNote;
import com.focusroom.repository.RoomNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class NoteController {

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @Autowired
    private RoomNoteRepository roomNoteRepository;

    public NoteController() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostMapping("/{roomId}/notes/upload")
    public ResponseEntity<RoomNote> uploadNote(@PathVariable String roomId,
                                               @RequestParam("file") MultipartFile file,
                                               @RequestHeader("X-User-Id") String userId,
                                               @RequestParam("userName") String userName) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }

            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + uniqueFileName;
            RoomNote note = new RoomNote(roomId, userId, userName, fileUrl, fileName);
            return ResponseEntity.ok(roomNoteRepository.save(note));

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @GetMapping("/{roomId}/notes")
    public ResponseEntity<List<RoomNote>> getRoomNotes(@PathVariable String roomId) {
        return ResponseEntity.ok(roomNoteRepository.findByRoomIdOrderByUploadedAtDesc(roomId));
    }
}
