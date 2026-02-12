package com.project.common.config

import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.format.DateTimeFormatter

@Configuration
class JacksonConfig {

    companion object {
        private const val DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss"
    }

    @Bean
    fun jackson2ObjectMapperBuilderCustomizer(): Jackson2ObjectMapperBuilderCustomizer {
        return Jackson2ObjectMapperBuilderCustomizer { builder ->
            val dateTimeFormatter = DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)

            // 시리얼라이저 (객체 -> JSON)
            builder.serializers(LocalDateTimeSerializer(dateTimeFormatter))
            // 데시리얼라이저 (JSON -> 객체)
            builder.deserializers(LocalDateTimeDeserializer(dateTimeFormatter))
        }
    }
}
