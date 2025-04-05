package com.splitapp.controller;

import com.splitapp.model.Group;
import com.splitapp.model.User;
import com.splitapp.service.GroupService;
import com.splitapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {

    private final GroupService groupService;
    private final UserService userService;

    @Autowired
    public GroupController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        return groupService.getGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<Group>> getGroupsByCreator(@PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(groupService.getGroupsByCreator(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/member/{userId}")
    public ResponseEntity<List<Group>> getGroupsByMember(@PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(groupService.getGroupsByMember(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@Valid @RequestBody Group group) {
        try {
            Group createdGroup = groupService.createGroup(group);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Long id, @Valid @RequestBody Group groupDetails) {
        try {
            Group updatedGroup = groupService.updateGroup(id, groupDetails);
            return ResponseEntity.ok(updatedGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> addMemberToGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        try {
            return userService.getUserById(userId)
                    .map(user -> ResponseEntity.ok(groupService.addMemberToGroup(groupId, user)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> removeMemberFromGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        try {
            return userService.getUserById(userId)
                    .map(user -> ResponseEntity.ok(groupService.removeMemberFromGroup(groupId, user)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}