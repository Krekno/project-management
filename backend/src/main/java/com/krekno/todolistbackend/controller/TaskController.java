package com.krekno.todolistbackend.controller;

import com.krekno.todolistbackend.model.Task;
import com.krekno.todolistbackend.model.User;
import com.krekno.todolistbackend.model.dto.TaskDto;
import com.krekno.todolistbackend.repository.TaskRepository;
import com.krekno.todolistbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks = user.getTasks();

        if (tasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(tasks);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<Task> addTask(@RequestBody TaskDto taskDto, Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        Task task = Task.builder()
                .title(taskDto.getTitle())
                .isCompleted(false)
                .user_id(user.getId())
                .build();

        taskRepository.save(task);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@RequestBody TaskDto taskDto, @PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(taskDto.getTitle());
        taskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggleTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setIsCompleted(!task.getIsCompleted());
        taskRepository.save(task);

        return ResponseEntity.ok(task);
    }
}
