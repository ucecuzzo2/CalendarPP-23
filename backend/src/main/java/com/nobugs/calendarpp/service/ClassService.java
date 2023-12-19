package com.nobugs.calendarpp.service;
import com.nobugs.calendarpp.dto.ClassDTO;
import com.nobugs.calendarpp.models.School;
import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.models.Class;
import com.nobugs.calendarpp.repository.ClassRepository;
import com.nobugs.calendarpp.repository.SchoolRepository;
import com.nobugs.calendarpp.repository.UserRepository;
import com.nobugs.calendarpp.utils.dto.EntityToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.Long.parseLong;

@Service
public class ClassService {

    @Autowired
    private UserFromJwtService userFromJwtService;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a class
    public Class createClass( String name, String semester, String canvasId, Long schoolId) {
        Optional<School> school = schoolRepository.findById(schoolId);
        if(school.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "School not found");
        }

        Class c = new Class(name, semester, canvasId, school.get());
        return classRepository.save(c);
    }

    public List<ClassDTO> getAllClasses() {
        List<Class> classes = classRepository.findAll();
        return classes.stream().map(EntityToDto::toClassDTO).collect(Collectors.toList());
    }

    public Object getClassById(Long classId) {
        Optional<Class> c = classRepository.findById(classId);

        if(c.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Class doesn't exist!");
        }

        return c.get();
    }

    public void deleteClass(Long classId) {
        Optional<Class> c = classRepository.findById(classId);

        if(c.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Class doesn't exist!");
        }

        classRepository.delete(c.get());
    }
}
