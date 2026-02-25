package com.project.dto.project

import com.fasterxml.jackson.annotation.JsonFormat
import com.project.entity.Project
import com.project.entity.User
import java.time.LocalDateTime

data class ProjectReq(
    val name: String,
    val description: String?,
    val userId: Long,
    val status: String = "ACTIVE"
) {
    fun toEntity(user: User): Project {
        return Project(
            name = this.name,
            description = this.description,
            creator = user,
            status = this.status
        )
    }
}

data class ProjectRes(
    val id: Long,
    val name: String,
    val description: String?,
    val status: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    val createdAt: LocalDateTime,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    val updatedAt: LocalDateTime
) {
    companion object {
        fun from(project: Project): ProjectRes {
            return ProjectRes(
                id = project.id!!,
                name = project.name,
                description = project.description,
                status = project.status,
                createdAt = project.createdAt,
                updatedAt = project.updatedAt
            )
        }
    }
}
