package com.splitapp.service;

import com.splitapp.model.Expense;
import com.splitapp.model.ExpenseSplit;
import com.splitapp.model.Group;
import com.splitapp.model.User;
import com.splitapp.repository.ExpenseRepository;
import com.splitapp.repository.ExpenseSplitRepository;
import com.splitapp.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final GroupRepository groupRepository;

    @Autowired
    public ExpenseService(
            ExpenseRepository expenseRepository, 
            ExpenseSplitRepository expenseSplitRepository,
            GroupRepository groupRepository) {
        this.expenseRepository = expenseRepository;
        this.expenseSplitRepository = expenseSplitRepository;
        this.groupRepository = groupRepository;
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public List<Expense> getExpensesByGroup(Group group) {
        return expenseRepository.findByGroup(group);
    }

    public List<Expense> getExpensesByPaidBy(User user) {
        return expenseRepository.findByPaidBy(user);
    }

    @Transactional
    public Expense createExpense(Expense expense, List<ExpenseSplit> splits) {
        // Validate that the expense belongs to a group
        if (expense.getGroup() == null || !groupRepository.existsById(expense.getGroup().getId())) {
            throw new RuntimeException("Expense must belong to a valid group");
        }
        
        // Set expense date if not provided
        if (expense.getExpenseDate() == null) {
            expense.setExpenseDate(LocalDateTime.now());
        }
        
        // Validate that the total split amount equals the expense amount
        BigDecimal totalSplitAmount = BigDecimal.ZERO;
        for (ExpenseSplit split : splits) {
            totalSplitAmount = totalSplitAmount.add(split.getAmount());
        }
        
        if (expense.getAmount().compareTo(totalSplitAmount) != 0) {
            throw new RuntimeException("The sum of split amounts must equal the expense amount");
        }
        
        // Save the expense first
        Expense savedExpense = expenseRepository.save(expense);
        
        // Save all the splits
        for (ExpenseSplit split : splits) {
            split.setExpense(savedExpense);
            split.setSettled(false);
            expenseSplitRepository.save(split);
        }
        
        return savedExpense;
    }

    @Transactional
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
    
    public List<ExpenseSplit> getExpenseSplitsByExpense(Expense expense) {
        return expenseSplitRepository.findByExpense(expense);
    }
    
    public List<ExpenseSplit> getExpenseSplitsByUser(User user) {
        return expenseSplitRepository.findByUser(user);
    }
    
    public List<ExpenseSplit> getUnsettledExpenseSplitsByUser(User user) {
        return expenseSplitRepository.findByUserAndSettledFalse(user);
    }
    
    @Transactional
    public ExpenseSplit markExpenseSplitAsSettled(Long expenseSplitId) {
        return expenseSplitRepository.findById(expenseSplitId)
                .map(expenseSplit -> {
                    expenseSplit.setSettled(true);
                    return expenseSplitRepository.save(expenseSplit);
                })
                .orElseThrow(() -> new RuntimeException("ExpenseSplit not found with id: " + expenseSplitId));
    }
}