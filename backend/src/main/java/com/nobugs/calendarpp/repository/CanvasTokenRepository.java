package com.nobugs.calendarpp.repository;

import com.nobugs.calendarpp.models.CanvasToken;
import com.nobugs.calendarpp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CanvasTokenRepository extends JpaRepository<CanvasToken, Long> {
    List<CanvasToken> findAllByUserId(long userId);
    void deleteBySchoolId(long schoolId);
}
