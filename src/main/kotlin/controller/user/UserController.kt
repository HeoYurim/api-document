package com.project.controller.user

import com.project.dto.user.UserReq
import com.project.dto.user.UserRes
import com.project.service.user.UserService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "User API", description = "사용자 관련 API")
@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService
) {

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록")
    @PostMapping("/register")
    fun register(@RequestBody req: UserReq): UserRes {
        return userService.register(req)
    }
}
