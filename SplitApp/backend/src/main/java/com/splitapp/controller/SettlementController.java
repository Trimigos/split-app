package com.splitapp.controller;

import com.splitapp.model.Group;
import com.splitapp.model.Settlement;
import com.splitapp.model.User;
import com.splitapp.service.GroupService;
import com.splitapp.service.SettlementService;
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
@RequestMapping("/api/settlements")
@CrossOrigin(origins = "*")
@Tag(name = "Settlement", description = "Settlement management APIs")
public class SettlementController {

    private final SettlementService settlementService;
    private final UserService userService;
    private final GroupService groupService;

    @Autowired
    public SettlementController(
            SettlementService settlementService,
            UserService userService,
            GroupService groupService) {
        this.settlementService = settlementService;
        this.userService = userService;
        this.groupService = groupService;
    }

    @Operation(summary = "Get all settlements", description = "Retrieves a list of all settlements in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all settlements",
                content = @Content(schema = @Schema(implementation = Settlement.class)))
    })
    @GetMapping
    public ResponseEntity<List<Settlement>> getAllSettlements() {
        return ResponseEntity.ok(settlementService.getAllSettlements());
    }

    @Operation(summary = "Get settlement by ID", description = "Retrieves a settlement by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the settlement",
                content = @Content(schema = @Schema(implementation = Settlement.class))),
        @ApiResponse(responseCode = "404", description = "Settlement not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Settlement> getSettlementById(
            @Parameter(description = "ID of the settlement to retrieve") @PathVariable Long id) {
        return settlementService.getSettlementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get settlements by group", description = "Retrieves all settlements for a specific group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved settlements for the group",
                content = @Content(schema = @Schema(implementation = Settlement.class))),
        @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Settlement>> getSettlementsByGroup(
            @Parameter(description = "ID of the group") @PathVariable Long groupId) {
        Optional<Group> group = groupService.getGroupById(groupId);
        if (group.isPresent()) {
            return ResponseEntity.ok(settlementService.getSettlementsByGroup(group.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get settlements by payer", description = "Retrieves all settlements where the specified user is the payer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved settlements from the user",
                content = @Content(schema = @Schema(implementation = Settlement.class))),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/from/{userId}")
    public ResponseEntity<List<Settlement>> getSettlementsByFromUser(
            @Parameter(description = "ID of the paying user") @PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(settlementService.getSettlementsByFromUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get settlements by recipient", description = "Retrieves all settlements where the specified user is the recipient")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved settlements to the user",
                content = @Content(schema = @Schema(implementation = Settlement.class))),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/to/{userId}")
    public ResponseEntity<List<Settlement>> getSettlementsByToUser(
            @Parameter(description = "ID of the recipient user") @PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(settlementService.getSettlementsByToUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get settlements by status", description = "Retrieves all settlements with a specific status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved settlements by status",
                content = @Content(schema = @Schema(implementation = Settlement.class)))
    })
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Settlement>> getSettlementsByStatus(
            @Parameter(description = "Status of settlements to retrieve") @PathVariable Settlement.SettlementStatus status) {
        return ResponseEntity.ok(settlementService.getSettlementsByStatus(status));
    }

    @Operation(summary = "Create a new settlement", description = "Creates a new settlement with the provided details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Settlement successfully created",
                content = @Content(schema = @Schema(implementation = Settlement.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<Settlement> createSettlement(
            @Parameter(description = "Settlement details") @Valid @RequestBody Settlement settlement) {
        try {
            Settlement createdSettlement = settlementService.createSettlement(settlement);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSettlement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Update settlement status", description = "Updates the status of an existing settlement")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Settlement status successfully updated",
                content = @Content(schema = @Schema(implementation = Settlement.class))),
        @ApiResponse(responseCode = "404", description = "Settlement not found"),
        @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<Settlement> updateSettlementStatus(
            @Parameter(description = "ID of the settlement to update") @PathVariable Long id, 
            @Parameter(description = "New settlement status") @RequestParam Settlement.SettlementStatus status) {
        try {
            Settlement updatedSettlement = settlementService.updateSettlementStatus(id, status);
            return ResponseEntity.ok(updatedSettlement);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a settlement", description = "Deletes a settlement by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Settlement successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Settlement not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSettlement(
            @Parameter(description = "ID of the settlement to delete") @PathVariable Long id) {
        settlementService.deleteSettlement(id);
        return ResponseEntity.noContent().build();
    }
}