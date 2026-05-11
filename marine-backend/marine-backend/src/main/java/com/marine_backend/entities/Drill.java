package com.marine_backend.entities;

import com.marine_backend.enums.DrillType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "drills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Drill extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;

    @Enumerated(EnumType.STRING)
    private DrillType type;

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @ManyToOne
    @JoinColumn(name = "ship_id")
    private Ship ship;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "drill")
    private List<DrillParticipation> participations;
}
