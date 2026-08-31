package org.personal.ctmss.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "audit_log")
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String role;
    
    @Column(nullable = false)
    private String action;
    
    @Column(length = 1000)
    private String details;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
