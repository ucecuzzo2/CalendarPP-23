package com.nobugs.calendarpp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.nobugs.calendarpp.models.Class;
import java.util.List;
import java.util.Set;

import com.nobugs.calendarpp.models.User;


public interface ClassRepository extends JpaRepository <Class, Long>  {
    // Add CRUD database methods find by
    List<Class> findByUsers(User user);

    List<Class> findBySchoolId(Long schoolId);

//    List<User> findClassByUsersId(Long userId);

}
