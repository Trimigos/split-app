package com.splitapp.controller;

import com.splitapp.model.Group;
import com.splitapp.model.Settlement;
import com.splitapp.model.User;
import com.splitapp.service.GroupService;
import com.splitapp.service.SettlementService;
import com.splitapp.service.UserService;
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

    @GetMapping
    public ResponseEntity<List<Settlement>> getAllSettlements() {
        return ResponseEntity.ok(settlementService.getAllSettlements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Settlement> getSettlementById(@PathVariable Long id) {
        return settlementService.getSettlementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Settlement>> getSettlementsByGroup(@PathVariable Long groupId) {
        Optional<Group> group = groupService.getGroupById(groupId);
        if (group.isPresent()) {
            return ResponseEntity.ok(settlementService.getSettlementsByGroup(group.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/from/{userId}")
    public ResponseEntity<List<Settlement>> getSettlementsByFromUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(settlementService.getSettlementsByFromUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/to/{userId}")
    public ResponseEntity<List<Settlement>> getSettlementsByToUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(settlementService.getSettlementsByToUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Settlement>> getSettlementsByStatus(@PathVariable Settlement.SettlementStatus status) {
        return ResponseEntity.ok(settlementService.getSettlementsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<Settlement> createSettlement(@Valid @RequestBody Settlement settlement) {
        try {
            Settlement createdSettlement = settlementService.createSettlement(settlement);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSettlement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Settlement> updateSettlementStatus(
            @PathVariable Long id, 
            @RequestParam Settlement.SettlementStatus status) {
        try {
            Settlement updatedSettlement = settlementService.updateSettlementStatus(id, status);
            return ResponseEntity.ok(updatedSettlement);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSettlement(@PathVariable Long id) {
        settlementService.deleteSettlement(id);
        return ResponseEntity.noContent().build();
    }
}