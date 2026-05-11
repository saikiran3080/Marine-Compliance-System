package com.marine_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "crew")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Crew extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "ship_id")
    private Ship ship;

    private String rank;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @OneToMany(mappedBy = "assignedCrew")
    private List<MaintenanceTask> assignedTasks;

    @OneToMany(mappedBy = "crew")
    private List<MaintenanceNote> notes;

    @OneToMany(mappedBy = "crew")
    private List<DrillParticipation> drillParticipations;
}
