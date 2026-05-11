package com.marine_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.ZoneId;
import java.util.TimeZone;

@SpringBootApplication()
public class MarineBackendApplication {

	static {
		TimeZone.setDefault(TimeZone.getTimeZone(ZoneId.of("UTC")));
	}

	public static void main(String[] args) {
		SpringApplication.run(MarineBackendApplication.class, args);
	}

}
