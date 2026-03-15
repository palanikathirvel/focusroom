package com.focusroom.service;

import com.focusroom.model.Task;
import com.focusroom.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(String userId, String taskName) {
        Task task = new Task(userId, taskName);
        return taskRepository.save(task);
    }

    public List<Task> getUserTasks(String userId) {
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Task updateTaskStatus(String taskId, Task.TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void deleteTask(String taskId) {
        taskRepository.deleteById(taskId);
    }

    public Task getTaskById(String taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }
}
