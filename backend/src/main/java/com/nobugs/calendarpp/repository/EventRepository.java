package com.nobugs.calendarpp.repository;

import com.nobugs.calendarpp.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUserId(long userId);
}
