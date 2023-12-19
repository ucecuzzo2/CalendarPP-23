package com.nobugs.calendarpp.dto;

import lombok.Data;

@Data
public class ClassDTO {
    private Long id;
    private String name;
    private String semester;
    private SchoolDTO school;
    private String canvasId;
}
