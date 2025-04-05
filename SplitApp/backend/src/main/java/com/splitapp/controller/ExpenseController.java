package com.splitapp.controller;

import com.splitapp.model.Expense;
import com.splitapp.model.ExpenseSplit;
import com.splitapp.model.Group;
import com.splitapp.model.User;
import com.splitapp.service.ExpenseService;
import com.splitapp.service.GroupService;
import com.splitapp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Expense", description = "Expense management APIs")
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

    @Operation(summary = "Get all expenses", description = "Retrieves a list of all expenses in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all expenses",
                content = @Content(schema = @Schema(implementation = Expense.class)))
    })
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @Operation(summary = "Get expense by ID", description = "Retrieves an expense by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the expense",
                content = @Content(schema = @Schema(implementation = Expense.class))),
        @ApiResponse(responseCode = "404", description = "Expense not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(
            @Parameter(description = "ID of the expense to retrieve") @PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get expenses by group", description = "Retrieves all expenses for a specific group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved expenses for the group",
                content = @Content(schema = @Schema(implementation = Expense.class))),
        @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getExpensesByGroup(
            @Parameter(description = "ID of the group") @PathVariable Long groupId) {
        Optional<Group> group = groupService.getGroupById(groupId);
        if (group.isPresent()) {
            return ResponseEntity.ok(expenseService.getExpensesByGroup(group.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get expenses by payer", description = "Retrieves all expenses paid by a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved expenses paid by the user",
                content = @Content(schema = @Schema(implementation = Expense.class))),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/paidby/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByPaidBy(
            @Parameter(description = "ID of the user who paid") @PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(expenseService.getExpensesByPaidBy(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create a new expense", description = "Creates a new expense with the provided details and splits")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Expense successfully created",
                content = @Content(schema = @Schema(implementation = Expense.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<?> createExpense(
            @Parameter(description = "Expense details") @Valid @RequestBody Expense expense, 
            @Parameter(description = "Expense splits among users") @RequestBody List<ExpenseSplit> splits) {
        try {
            Expense createdExpense = expenseService.createExpense(expense, splits);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Delete an expense", description = "Deletes an expense by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Expense successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Expense not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @Parameter(description = "ID of the expense to delete") @PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "Get expense splits by expense", description = "Retrieves all splits for a specific expense")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved expense splits",
                content = @Content(schema = @Schema(implementation = ExpenseSplit.class))),
        @ApiResponse(responseCode = "404", description = "Expense not found")
    })
    @GetMapping("/{expenseId}/splits")
    public ResponseEntity<List<ExpenseSplit>> getExpenseSplitsByExpense(
            @Parameter(description = "ID of the expense") @PathVariable Long expenseId) {
        Optional<Expense> expense = expenseService.getExpenseById(expenseId);
        if (expense.isPresent()) {
            return ResponseEntity.ok(expenseService.getExpenseSplitsByExpense(expense.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    @Operation(summary = "Get expense splits by user", description = "Retrieves all expense splits for a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved expense splits for the user",
                content = @Content(schema = @Schema(implementation = ExpenseSplit.class))),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/splits/user/{userId}")
    public ResponseEntity<List<ExpenseSplit>> getExpenseSplitsByUser(
            @Parameter(description = "ID of the user") @PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(expenseService.getExpenseSplitsByUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    @Operation(summary = "Get unsettled expense splits by user", description = "Retrieves all unsettled expense splits for a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved unsettled expense splits for the user",
                content = @Content(schema = @Schema(implementation = ExpenseSplit.class))),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/splits/user/{userId}/unsettled")
    public ResponseEntity<List<ExpenseSplit>> getUnsettledExpenseSplitsByUser(
            @Parameter(description = "ID of the user") @PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(expenseService.getUnsettledExpenseSplitsByUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }
    
    @Operation(summary = "Mark expense split as settled", description = "Marks a specific expense split as settled")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Expense split successfully marked as settled",
                content = @Content(schema = @Schema(implementation = ExpenseSplit.class))),
        @ApiResponse(responseCode = "404", description = "Expense split not found")
    })
    @PutMapping("/splits/{splitId}/settle")
    public ResponseEntity<ExpenseSplit> markExpenseSplitAsSettled(
            @Parameter(description = "ID of the expense split") @PathVariable Long splitId) {
        try {
            ExpenseSplit settledSplit = expenseService.markExpenseSplitAsSettled(splitId);
            return ResponseEntity.ok(settledSplit);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}