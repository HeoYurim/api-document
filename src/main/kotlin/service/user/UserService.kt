package com.project.service.user

import com.project.common.exception.CustomException
import com.project.common.exception.ErrorCode
import com.project.dto.user.UserReq
import com.project.dto.user.UserRes
import com.project.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class UserService(
    private val userRepository: UserRepository
) {

    @Transactional
    fun register(req: UserReq): UserRes {
        // 중복 아이디 체크
        if (userRepository.findByUsername(req.username) != null) {
            throw CustomException(ErrorCode.DUPLICATE_USERNAME)
        }

        // 비밀번호 암호화는 나중에 Security 추가하면 그때 변경
        val savedUser = userRepository.save(req.toEntity())
        return UserRes.from(savedUser)
    }
}
