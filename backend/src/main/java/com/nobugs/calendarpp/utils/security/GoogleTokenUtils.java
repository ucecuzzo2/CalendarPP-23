package com.nobugs.calendarpp.utils.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleTokenUtils {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public GoogleUserDetails validateAndExtractDetails(String tokenId) throws Exception {

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(tokenId);
        if (idToken != null) {
            Payload payload = idToken.getPayload();
            GoogleUserDetails userDetails = new GoogleUserDetails();
            userDetails.setEmail(payload.getEmail());
            userDetails.setFirstName((String) payload.get("given_name"));
            userDetails.setLastName((String) payload.get("family_name"));
            return userDetails;
        } else {
            throw new Exception("Invalid ID token.");
        }
    }

    @Data
    public static class GoogleUserDetails {
        private String email;
        private String firstName;
        private String lastName;
        // getters, setters, and other necessary methods
    }
}

