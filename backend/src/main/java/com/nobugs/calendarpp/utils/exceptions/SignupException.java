package com.nobugs.calendarpp.utils.exceptions;

import lombok.Getter;

import java.util.Map;

@Getter
public class SignupException extends Exception{
    private final Map<String,String> errors;

    public SignupException(Map<String, String> errors){
        super();
        this.errors = errors;
    }
}
