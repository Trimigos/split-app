package com.splitapp.controller;

import com.splitapp.model.Group;
import com.splitapp.model.User;
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

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
@Tag(name = "Group", description = "Group management APIs")
public class GroupController {

    private final GroupService groupService;
    private final UserService userService;

    @Autowired
    public GroupController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    @Operation(summary = "Get all groups", description = "Retrieves a list of all groups in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all groups",
                content = @Content(schema = @Schema(implementation = Group.class)))
    })
    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @Operation(summary = "Get group by ID", description = "Retrieves a group by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the group",
                content = @Content(schema = @Schema(implementation = Group.class))),
        @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(
            @Parameter(description = "ID of the group to retrieve") @PathVariable Long id) {
        return groupService.getGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get groups by creator", description = "Retrieves all groups created by a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved groups created by the user",
                content = @Content(schema = @Schema(implementation = Group.class))),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<Group>> getGroupsByCreator(
            @Parameter(description = "ID of the creator user") @PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(groupService.getGroupsByCreator(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get groups by member", description = "Retrieves all groups where the specified user is a member")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved groups where the user is a member",
                content = @Content(schema = @Schema(implementation = Group.class))),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/member/{userId}")
    public ResponseEntity<List<Group>> getGroupsByMember(
            @Parameter(description = "ID of the member user") @PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(groupService.getGroupsByMember(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new group", description = "Creates a new group with the provided details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Group successfully created",
                content = @Content(schema = @Schema(implementation = Group.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<Group> createGroup(
            @Parameter(description = "Group details") @Valid @RequestBody Group group) {
        try {
            Group createdGroup = groupService.createGroup(group);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Update a group", description = "Updates an existing group with the provided details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Group successfully updated",
                content = @Content(schema = @Schema(implementation = Group.class))),
        @ApiResponse(responseCode = "404", description = "Group not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(
            @Parameter(description = "ID of the group to update") @PathVariable Long id, 
            @Parameter(description = "Updated group details") @Valid @RequestBody Group groupDetails) {
        try {
            Group updatedGroup = groupService.updateGroup(id, groupDetails);
            return ResponseEntity.ok(updatedGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Add member to group", description = "Adds a user as a member to a specific group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User successfully added to the group",
                content = @Content(schema = @Schema(implementation = Group.class))),
        @ApiResponse(responseCode = "404", description = "Group or user not found"),
        @ApiResponse(responseCode = "400", description = "User is already a member of the group")
    })
    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> addMemberToGroup(
            @Parameter(description = "ID of the group") @PathVariable Long groupId, 
            @Parameter(description = "ID of the user to add") @PathVariable Long userId) {
        try {
            return userService.getUserById(userId)
                    .map(user -> ResponseEntity.ok(groupService.addMemberToGroup(groupId, user)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Remove member from group", description = "Removes a user from a specific group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User successfully removed from the group",
                content = @Content(schema = @Schema(implementation = Group.class))),
        @ApiResponse(responseCode = "404", description = "Group or user not found"),
        @ApiResponse(responseCode = "400", description = "User is not a member of the group")
    })
    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> removeMemberFromGroup(
            @Parameter(description = "ID of the group") @PathVariable Long groupId, 
            @Parameter(description = "ID of the user to remove") @PathVariable Long userId) {
        try {
            return userService.getUserById(userId)
                    .map(user -> ResponseEntity.ok(groupService.removeMemberFromGroup(groupId, user)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Delete a group", description = "Deletes a group by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Group successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(
            @Parameter(description = "ID of the group to delete") @PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}