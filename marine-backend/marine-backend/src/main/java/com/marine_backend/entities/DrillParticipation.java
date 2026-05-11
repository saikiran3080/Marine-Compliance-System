package com.marine_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "drill_participation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrillParticipation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "drill_id")
    private Drill drill;

    @ManyToOne
    @JoinColumn(name = "crew_id")
    private Crew crew;

    private Boolean attended;

    private Boolean completed;

    @Column(columnDefinition = "TEXT")
    private String remarks;
}
