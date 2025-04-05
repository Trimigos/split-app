package com.splitapp.repository;

import com.splitapp.model.Expense;
import com.splitapp.model.ExpenseSplit;
import com.splitapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    List<ExpenseSplit> findByExpense(Expense expense);
    List<ExpenseSplit> findByUser(User user);
    List<ExpenseSplit> findByUserAndSettledFalse(User user);
}