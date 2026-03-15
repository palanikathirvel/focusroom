package com.focusroom.controller;

import com.focusroom.dto.CreateTaskRequest;
import com.focusroom.model.Task;
import com.focusroom.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody CreateTaskRequest request) {
        Task task = taskService.createTask(request.getUserId(), request.getTaskName());
        return ResponseEntity.ok(task);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getUserTasks(@PathVariable String userId) {
        return ResponseEntity.ok(taskService.getUserTasks(userId));
    }

    @PutMapping("/{taskId}/update")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable String taskId,
            @RequestParam String status) {
        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase());
        Task task = taskService.updateTaskStatus(taskId, taskStatus);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable String taskId) {
        taskService.deleteTask(taskId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Task deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable String taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }
}
