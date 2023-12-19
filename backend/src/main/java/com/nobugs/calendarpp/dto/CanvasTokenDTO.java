package com.nobugs.calendarpp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CanvasTokenDTO {
    private long id;
    private String token;
    private long userId;
    private SchoolDTO school;
}
