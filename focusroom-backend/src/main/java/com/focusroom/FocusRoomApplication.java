package com.focusroom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class FocusRoomApplication {

    public static void main(String[] args) {
        SpringApplication.run(FocusRoomApplication.class, args);
    }
}
