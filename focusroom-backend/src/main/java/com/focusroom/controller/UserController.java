package com.focusroom.controller;

import com.focusroom.model.User;
import com.focusroom.repository.UserRepository;
import com.focusroom.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public UserController() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userDetailsService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<User>> getUsersByIds(@RequestBody Map<String, List<String>> request) {
        List<String> userIds = request.get("userIds");
        List<User> users = new ArrayList<>();

        if (userIds != null) {
            for (String userId : userIds) {
                try {
                    User user = userDetailsService.getUserById(userId);
                    users.add(user);
                } catch (Exception e) {
                    // Skip if user not found
                }
            }
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{userId}/photo")
    public ResponseEntity<User> uploadProfilePhoto(@PathVariable String userId,
                                                   @RequestParam("file") MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }

            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + uniqueFileName;
            user.setProfileImageUrl(fileUrl);
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
}
