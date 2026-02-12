package com.project.common.exception

class CustomException(
    val errorCode: ErrorCode
) : RuntimeException(errorCode.message)
