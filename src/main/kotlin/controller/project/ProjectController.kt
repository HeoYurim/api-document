package com.project.controller.project

import com.project.dto.project.ProjectReq
import com.project.dto.project.ProjectRes
import com.project.service.project.ProjectService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@Tag(name = "Project API", description = "프로젝트 관련 API")
@RestController
@RequestMapping("/projects")
class ProjectController(
    private val projectService: ProjectService
) {

    @Operation(summary = "프로젝트 생성", description = "새로운 프로젝트를 생성")
    @PostMapping("/register")
    fun createProject(@RequestBody req: ProjectReq): ProjectRes {
        return projectService.createProject(req)
    }

    @Operation(summary = "프로젝트 목록 조회", description = "모든 프로젝트 목록을 조회")
    @GetMapping("/list")
    fun getAllProjects(): List<ProjectRes> {
        return projectService.getAllProjects()
    }

    @Operation(summary = "프로젝트 단건 조회", description = "ID로 특정 프로젝트를 조회")
    @GetMapping("/{id}")
    fun getProject(@PathVariable id: Long): ProjectRes {
        return projectService.getProject(id)
    }
}
