package com.nobugs.calendarpp.service;

import com.nobugs.calendarpp.models.User;
import com.nobugs.calendarpp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class UserFromJwtService {

    @Autowired
    private UserRepository userRepository;

    public User getUserFromJwt() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth.getPrincipal() instanceof Jwt jwt) {
            String email = jwt.getClaim("email");
            return userRepository.findByEmail(email);
        }

        return null;
    }
}
