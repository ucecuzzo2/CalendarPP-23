package com.nobugs.calendarpp.repository;

import com.nobugs.calendarpp.models.Class;
import com.nobugs.calendarpp.models.Event;
import com.nobugs.calendarpp.models.School;
import com.nobugs.calendarpp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchoolRepository extends JpaRepository<School, Long> {

    List<School> findByUsers(User user);
}
