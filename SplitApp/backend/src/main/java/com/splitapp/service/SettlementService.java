package com.splitapp.service;

import com.splitapp.model.Group;
import com.splitapp.model.Settlement;
import com.splitapp.model.User;
import com.splitapp.repository.SettlementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class SettlementService {

    private final SettlementRepository settlementRepository;

    @Autowired
    public SettlementService(SettlementRepository settlementRepository) {
        this.settlementRepository = settlementRepository;
    }

    public List<Settlement> getAllSettlements() {
        return settlementRepository.findAll();
    }

    public Optional<Settlement> getSettlementById(Long id) {
        return settlementRepository.findById(id);
    }

    public List<Settlement> getSettlementsByGroup(Group group) {
        return settlementRepository.findByGroup(group);
    }

    public List<Settlement> getSettlementsByFromUser(User user) {
        return settlementRepository.findByFromUser(user);
    }

    public List<Settlement> getSettlementsByToUser(User user) {
        return settlementRepository.findByToUser(user);
    }

    public List<Settlement> getSettlementsByStatus(Settlement.SettlementStatus status) {
        return settlementRepository.findByStatus(status);
    }

    @Transactional
    public Settlement createSettlement(Settlement settlement) {
        // Initialize with PENDING status if not set
        if (settlement.getStatus() == null) {
            settlement.setStatus(Settlement.SettlementStatus.PENDING);
        }
        return settlementRepository.save(settlement);
    }

    @Transactional
    public Settlement updateSettlementStatus(Long id, Settlement.SettlementStatus status) {
        return settlementRepository.findById(id)
                .map(settlement -> {
                    settlement.setStatus(status);
                    return settlementRepository.save(settlement);
                })
                .orElseThrow(() -> new RuntimeException("Settlement not found with id: " + id));
    }

    @Transactional
    public void deleteSettlement(Long id) {
        settlementRepository.deleteById(id);
    }
}