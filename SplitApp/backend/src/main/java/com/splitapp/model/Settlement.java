package com.splitapp.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "settlements")
public class Settlement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;
    
    @ManyToOne
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;
    
    @ManyToOne
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;
    
    @NotNull
    @Positive
    private BigDecimal amount;
    
    private String notes;
    
    @Enumerated(EnumType.STRING)
    private SettlementStatus status;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    public enum SettlementStatus {
        PENDING, COMPLETED, CANCELLED
    }
}