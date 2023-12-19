package com.nobugs.calendarpp.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestBody {
    private String email;
    private String firstName;
    private String lastName;
}
