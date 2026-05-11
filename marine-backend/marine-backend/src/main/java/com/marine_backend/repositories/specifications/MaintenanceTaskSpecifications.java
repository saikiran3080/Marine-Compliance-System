package com.marine_backend.repositories.specifications;

import com.marine_backend.entities.MaintenanceTask;
import com.marine_backend.enums.MaintenanceStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public final class MaintenanceTaskSpecifications {
    private MaintenanceTaskSpecifications() {
    }

    public static Specification<MaintenanceTask> filters(
            UUID shipId,
            MaintenanceStatus status,
            UUID assignedCrewId,
            Boolean overdue,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        return Specification.where(shipId(shipId))
                .and(status(status))
                .and(assignedCrewId(assignedCrewId))
                .and(overdue(overdue))
                .and(dateRange(fromDate, toDate));
    }

    private static Specification<MaintenanceTask> shipId(UUID shipId) {
        return (root, query, cb) -> shipId == null ? cb.conjunction() : cb.equal(root.get("ship").get("id"), shipId);
    }

    private static Specification<MaintenanceTask> status(MaintenanceStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    private static Specification<MaintenanceTask> assignedCrewId(UUID assignedCrewId) {
        return (root, query, cb) -> assignedCrewId == null ? cb.conjunction() : cb.equal(root.get("assignedCrew").get("id"), assignedCrewId);
    }

    private static Specification<MaintenanceTask> overdue(Boolean overdue) {
        return (root, query, cb) -> {
            if (overdue == null) {
                return cb.conjunction();
            }
            var isOverdue = cb.and(
                    cb.lessThan(root.get("dueDate"), LocalDateTime.now()),
                    cb.notEqual(root.get("status"), MaintenanceStatus.COMPLETED)
            );
            return overdue ? isOverdue : cb.not(isOverdue);
        };
    }

    private static Specification<MaintenanceTask> dateRange(LocalDate fromDate, LocalDate toDate) {
        return (root, query, cb) -> {
            if (fromDate == null && toDate == null) {
                return cb.conjunction();
            }
            if (fromDate != null && toDate != null) {
                return cb.between(root.get("dueDate"), fromDate.atStartOfDay(), toDate.plusDays(1).atStartOfDay().minusNanos(1));
            }
            if (fromDate != null) {
                return cb.greaterThanOrEqualTo(root.get("dueDate"), fromDate.atStartOfDay());
            }
            return cb.lessThanOrEqualTo(root.get("dueDate"), toDate.plusDays(1).atStartOfDay().minusNanos(1));
        };
    }
}
