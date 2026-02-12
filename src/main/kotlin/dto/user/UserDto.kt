package com.project.dto.user

import com.fasterxml.jackson.annotation.JsonFormat
import com.project.entity.User
import java.time.LocalDateTime

data class UserReq(
    val username: String,
    val password: String // 나중엔 암호화 필요
) {
    fun toEntity(): User {
        return User(
            username = this.username,
            password = this.password
        )
    }
}

data class UserRes(
    val id: Long,
    val username: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(user: User): UserRes {
            return UserRes(
                id = user.id!!,
                username = user.username,
                createdAt = user.createdAt
            )
        }
    }
}
