package com.nobugs.calendarpp.repository;

import com.nobugs.calendarpp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    boolean existsByUsername(String username);

//    List<Class> findUsersByClassId(Long classId);


}
