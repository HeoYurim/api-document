package com.project.service.user

import com.project.common.exception.CustomException
import com.project.common.exception.ErrorCode
import com.project.dto.user.UserReq
import com.project.entity.User
import com.project.repository.UserRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.any
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class UserServiceTest {

    @Mock
    lateinit var userRepository: UserRepository

    @InjectMocks
    lateinit var userService: UserService

    @Test
    fun `회원가입_성공`() {
        // given
        val req = UserReq("testuser", "password1234")
        val user = User(username = "testuser", password = "password1234", id = 1L)

        `when`(userRepository.findByUsername(req.username)).thenReturn(null)
        `when`(userRepository.save(any(User::class.java))).thenReturn(user)

        // when
        val result = userService.register(req)

        // then
        assertEquals("testuser", result.username)
        assertEquals(1L, result.id)
    }

    @Test
    fun `회원가입_실패_중복아이디`() {
        // given
        val req = UserReq("duplicateUser", "password1234")
        val existingUser = User(username = "duplicateUser", password = "oldPassword")

        `when`(userRepository.findByUsername(req.username)).thenReturn(existingUser)

        // when & then
        val exception = assertThrows(CustomException::class.java) {
            userService.register(req)
        }
        assertEquals(ErrorCode.DUPLICATE_USERNAME, exception.errorCode)
    }
}
