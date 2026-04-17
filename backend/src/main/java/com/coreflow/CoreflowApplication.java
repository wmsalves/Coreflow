package com.coreflow;

import com.coreflow.config.DotenvEnvironmentLoader;
import com.coreflow.config.RequiredEnvironmentValidator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CoreflowApplication {

    public static void main(String[] args) {
        DotenvEnvironmentLoader.load();
        RequiredEnvironmentValidator.validateAscendConfig();
        SpringApplication.run(CoreflowApplication.class, args);
    }
}
