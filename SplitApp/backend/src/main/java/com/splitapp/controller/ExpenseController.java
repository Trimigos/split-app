package com.splitapp.controller;

import com.splitapp.model.Expense;
import com.splitapp.model.ExpenseSplit;
import com.splitapp.model.Group;
import com.splitapp.model.User;
import com.splitapp.service.ExpenseService;
import com.splitapp.service.GroupService;
import com.splitapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;
    private final GroupService groupService;

    @Autowired
    public ExpenseController(
            ExpenseService expenseService,
            UserService userService,
            GroupService groupService) {
        this.expenseService = expenseService;
        this.userService = userService;
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getExpensesByGroup(@PathVariable Long groupId) {
        Optional<Group> group = groupService.getGroupById(groupId);
        if (group.isPresent()) {
            return ResponseEntity.ok(expenseService.getExpensesByGroup(group.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/paidby/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByPaidBy(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(expenseService.getExpensesByPaidBy(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@Valid @RequestBody Expense expense, @RequestBody List<ExpenseSplit> splits) {
        try {
            Expense createdExpense = expenseService.createExpense(expense, splits);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{expenseId}/splits")
    public ResponseEntity<List<ExpenseSplit>> getExpenseSplitsByExpense(@PathVariable Long expenseId) {
        Optional<Expense> expense = expenseService.getExpenseById(expenseId);
        if (expense.isPresent()) {
            return ResponseEntity.ok(expenseService.getExpenseSplitsByExpense(expense.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/splits/user/{userId}")
    public ResponseEntity<List<ExpenseSplit>> getExpenseSplitsByUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(expenseService.getExpenseSplitsByUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/splits/user/{userId}/unsettled")
    public ResponseEntity<List<ExpenseSplit>> getUnsettledExpenseSplitsByUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(expenseService.getUnsettledExpenseSplitsByUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/splits/{splitId}/settle")
    public ResponseEntity<ExpenseSplit> markExpenseSplitAsSettled(@PathVariable Long splitId) {
        try {
            ExpenseSplit settledSplit = expenseService.markExpenseSplitAsSettled(splitId);
            return ResponseEntity.ok(settledSplit);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}