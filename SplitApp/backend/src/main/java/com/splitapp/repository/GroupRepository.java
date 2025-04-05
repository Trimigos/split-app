package com.splitapp.repository;

import com.splitapp.model.Group;
import com.splitapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByCreator(User creator);
    List<Group> findByMembersContaining(User member);
}