package com.splitapp.repository;

import com.splitapp.model.Group;
import com.splitapp.model.Settlement;
import com.splitapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    List<Settlement> findByGroup(Group group);
    List<Settlement> findByFromUser(User user);
    List<Settlement> findByToUser(User user);
    List<Settlement> findByStatus(Settlement.SettlementStatus status);
}