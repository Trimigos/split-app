package com.splitapp.repository;

import com.splitapp.model.Expense;
import com.splitapp.model.Group;
import com.splitapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroup(Group group);
    List<Expense> findByPaidBy(User user);
}