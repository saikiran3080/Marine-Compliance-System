package com.marine_backend.repositories.specifications;

import com.marine_backend.entities.Drill;
import com.marine_backend.enums.DrillType;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.UUID;

public final class DrillSpecifications {
    private DrillSpecifications() {
    }

    public static Specification<Drill> filters(UUID shipId, DrillType type, LocalDate date, Boolean completed) {
        return Specification.where(shipId(shipId))
                .and(type(type))
                .and(date(date))
                .and(completed(completed));
    }

    private static Specification<Drill> shipId(UUID shipId) {
        return (root, query, cb) -> shipId == null ? cb.conjunction() : cb.equal(root.get("ship").get("id"), shipId);
    }

    private static Specification<Drill> type(DrillType type) {
        return (root, query, cb) -> type == null ? cb.conjunction() : cb.equal(root.get("type"), type);
    }

    private static Specification<Drill> date(LocalDate date) {
        return (root, query, cb) -> {
            if (date == null) {
                return cb.conjunction();
            }
            return cb.between(root.get("scheduledDate"), date.atStartOfDay(), date.plusDays(1).atStartOfDay().minusNanos(1));
        };
    }

    private static Specification<Drill> completed(Boolean completed) {
        return (root, query, cb) -> {
            if (completed == null) {
                return cb.conjunction();
            }
            if (query != null) {
                query.distinct(true);
            }
            var participations = root.join("participations", JoinType.LEFT);
            return completed ? cb.isTrue(participations.get("completed")) : cb.or(
                    cb.isNull(participations.get("id")),
                    cb.isFalse(participations.get("completed"))
            );
        };
    }
}
