package com.splitapp.service;

import com.splitapp.model.Group;
import com.splitapp.model.GroupMember;
import com.splitapp.model.User;
import com.splitapp.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public List<Group> getGroupsByCreator(User creator) {
        return groupRepository.findByCreator(creator);
    }

    public List<Group> getGroupsByMember(User member) {
        return groupRepository.findByMembersContaining(member);
    }

    @Transactional
    public Group createGroup(Group group) {
        // Add creator as a member
        if (!group.getMembers().contains(group.getCreator())) {
            group.getMembers().add(group.getCreator());
        }
        return groupRepository.save(group);
    }

    @Transactional
    public Group updateGroup(Long id, Group groupDetails) {
        return groupRepository.findById(id)
                .map(existingGroup -> {
                    existingGroup.setName(groupDetails.getName());
                    existingGroup.setDescription(groupDetails.getDescription());
                    return groupRepository.save(existingGroup);
                })
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
    }

    @Transactional
    public Group addMemberToGroup(Long groupId, User user) {
        return groupRepository.findById(groupId)
                .map(group -> {
                    if (!group.getMembers().contains(user)) {
                        group.getMembers().add(user);
                        return groupRepository.save(group);
                    }
                    return group;
                })
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
    }

    @Transactional
    public Group removeMemberFromGroup(Long groupId, User user) {
        return groupRepository.findById(groupId)
                .map(group -> {
                    // Cannot remove creator
                    if (group.getCreator().equals(user)) {
                        throw new RuntimeException("Cannot remove the creator from the group");
                    }
                    group.getMembers().remove(user);
                    return groupRepository.save(group);
                })
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
    }

    @Transactional
    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }
}