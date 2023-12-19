package com.nobugs.calendarpp.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.regex.Pattern;

public class InputValidation {

    /*
    * Usernames are only valid
    * */
    public static boolean validateUsername(String username){
        final String regex = "^[a-zA-Z][\\w_]{3,19}$";
        final Pattern pattern = Pattern.compile(regex, Pattern.MULTILINE);

        return pattern.matcher(username).matches();
    }

    public static boolean validateDate(String date){
        try{
            LocalDate.parse(date);
        } catch(DateTimeParseException e){
            return false;
        }
        return true;
    }

    public static boolean validateDateTime(String dateTime){
        try{
            LocalDateTime.parse(dateTime);
        } catch(DateTimeParseException e){
            return false;
        }
        return true;
    }

    public static boolean validateName(String name){
        final String regex = "^[a-zA-Z]{1,19}$";
        final Pattern pattern = Pattern.compile(regex, Pattern.MULTILINE);

        return pattern.matcher(name).matches();
    }

    public static boolean validateEmail(String email){
        final String regex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        final Pattern pattern = Pattern.compile(regex, Pattern.MULTILINE);

        return pattern.matcher(email).matches();
    }

    public static boolean validateLong(String str) {
        try {
            Long.parseLong(str);
            return true;
        } catch(NumberFormatException e){
            return false;
        }
    }

}
