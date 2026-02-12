package com.project.common.dto

import com.project.common.exception.ErrorCode

data class ErrorResponse(
    val code: String,
    val message: String
) {
    companion object {
        fun of(errorCode: ErrorCode): ErrorResponse {
            return ErrorResponse(
                code = errorCode.name,
                message = errorCode.message
            )
        }
    }
}
