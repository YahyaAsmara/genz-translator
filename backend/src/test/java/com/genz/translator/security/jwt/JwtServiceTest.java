package com.genz.translator.security.jwt;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void generatesAndValidatesAccessToken() {
        UserDetails user = User.withUsername("tester@genz.com")
                .password("password")
                .roles("USER")
                .build();

        String token = jwtService.generateAccessToken(user, Map.of("handle", "tester"));

        assertThat(jwtService.extractUsername(token)).isEqualTo("tester@genz.com");
        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }
}
