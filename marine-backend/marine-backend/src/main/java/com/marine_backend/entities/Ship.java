package com.marine_backend.entities;


import com.marine_backend.enums.ShipStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "imo_number", unique = true)
    private String imoNumber;

    private String type;

    @Enumerated(EnumType.STRING)
    private ShipStatus status;

    @OneToMany(mappedBy = "ship")
    private List<Crew> crewMembers;

    @OneToMany(mappedBy = "ship")
    private List<MaintenanceTask> maintenanceTasks;

    @OneToMany(mappedBy = "ship")
    private List<Drill> drills;
}
