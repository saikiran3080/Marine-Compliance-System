package com.marine_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "maintenance_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceNote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private MaintenanceTask task;

    @ManyToOne
    @JoinColumn(name = "crew_id")
    private Crew crew;

    @Column(columnDefinition = "TEXT")
    private String note;
}
