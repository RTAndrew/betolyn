package com.betolyn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class BetOlynApplication {

	public static void main(String[] args) {
		SpringApplication.run(BetOlynApplication.class, args);
	}
}
