package com.nobugs.calendarpp.utils.dto;

import com.nobugs.calendarpp.dto.CanvasTokenDTO;
import com.nobugs.calendarpp.dto.ClassDTO;
import com.nobugs.calendarpp.dto.SchoolDTO;
import com.nobugs.calendarpp.models.CanvasToken;
import com.nobugs.calendarpp.models.Class;
import com.nobugs.calendarpp.models.School;

public class EntityToDto {

    public static ClassDTO toClassDTO(Class classEntity){
        ClassDTO dto = new ClassDTO();
        dto.setId(classEntity.getId());
        dto.setName(classEntity.getName());
        dto.setSemester(classEntity.getSemester());

        School schoolEntity = classEntity.getSchool();
        if (schoolEntity != null) {
            SchoolDTO schoolDTO = new SchoolDTO();
            schoolDTO.setId(schoolEntity.getId());
            schoolDTO.setName(schoolEntity.getName());

            dto.setSchool(schoolDTO);
        }

        return dto;
    }

    public static CanvasTokenDTO toTokenDTO(CanvasToken tokenEntity){
        CanvasTokenDTO dto = new CanvasTokenDTO();
        dto.setId(tokenEntity.getId());
        dto.setToken(tokenEntity.getToken());
        dto.setUserId(tokenEntity.getUserId());

        School schoolEntity = tokenEntity.getSchool();
        if (schoolEntity != null) {
            SchoolDTO schoolDTO = new SchoolDTO();
            schoolDTO.setId(schoolEntity.getId());
            schoolDTO.setName(schoolEntity.getName());

            dto.setSchool(schoolDTO);
        }

        return dto;
    }
}
