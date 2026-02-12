package com.project.common.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.media.Schema
import org.springdoc.core.utils.SpringDocUtils
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Configuration
class SwaggerConfig {

    init {
        // Swagger UI의 Example Value에서 LocalDateTime 포맷을 고정
        val schema = Schema<LocalDateTime>()
        schema.example(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
        schema.type("string")
        
        SpringDocUtils.getConfig().replaceWithSchema(LocalDateTime::class.java, schema)
    }

    @Bean
    fun openApi(): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title("API Document Project")
                    .description("API 연동 규격서 프로젝트 API 명세서입니다.")
                    .version("v1.0.0")
            )
    }
}
