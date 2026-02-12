package com.project.service.project

import com.project.common.exception.CustomException
import com.project.common.exception.ErrorCode
import com.project.dto.project.ProjectReq
import com.project.dto.project.ProjectRes
import com.project.repository.ProjectRepository
import com.project.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class ProjectService(
    private val projectRepository: ProjectRepository,
    private val userRepository: UserRepository
) {
    // 프로젝트 생성
    @Transactional
    fun createProject(req: ProjectReq): ProjectRes {
        val user = userRepository.findById(req.userId).orElseThrow {
            CustomException(ErrorCode.USER_NOT_FOUND)
        }
        val savedProject = projectRepository.save(req.toEntity(user))
        return ProjectRes.from(savedProject)
    }

    // 프로젝트 전체 조회 (데이터 없으면 에러 발생)
    fun getAllProjects(): List<ProjectRes> {
        val projects = projectRepository.findAll()
        if (projects.isEmpty()) {
            throw CustomException(ErrorCode.PROJECT_NOT_FOUND)
        }
        return projects.map { ProjectRes.from(it) }
    }

    // 프로젝트 단건 조회
    fun getProject(id: Long): ProjectRes {
        val project = projectRepository.findById(id).orElseThrow {
            CustomException(ErrorCode.PROJECT_NOT_FOUND)
        }
        return ProjectRes.from(project)
    }
}
