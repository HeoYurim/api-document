package com.project

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ApiDocumentApplication

fun main(args: Array<String>) {
    runApplication<ApiDocumentApplication>(*args)
}