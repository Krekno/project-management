package com.krekno.todolistbackend.repository;

import com.krekno.todolistbackend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
