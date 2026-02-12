-- Users 테이블 (사용자 정보)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,                -- 사용자 고유 ID (PK, 자동 증가)
    username VARCHAR(50) NOT NULL UNIQUE,    -- 로그인 아이디 (중복 불가)
    password VARCHAR(255) NOT NULL,          -- 암호화된 비밀번호
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 계정 생성 일시
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP  -- 계정 정보 수정 일시
);

COMMENT ON TABLE users IS '사용자 정보 테이블';
COMMENT ON COLUMN users.id IS '사용자 고유 ID (PK)';
COMMENT ON COLUMN users.username IS '로그인 아이디';
COMMENT ON COLUMN users.password IS '암호화된 비밀번호';
COMMENT ON COLUMN users.created_at IS '계정 생성 일시';
COMMENT ON COLUMN users.updated_at IS '계정 정보 수정 일시';


-- Project 테이블 (프로젝트 정보)
CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,                -- 프로젝트 고유 ID (PK, 자동 증가)
    name VARCHAR(255) NOT NULL,              -- 프로젝트 이름
    description TEXT,                        -- 프로젝트 설명
    creator_id BIGINT NOT NULL,              -- 프로젝트 생성자 ID (User 테이블 FK)
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 프로젝트 생성 일시
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 프로젝트 수정 일시
    
    -- 외래키 제약조건: creator_id는 users 테이블의 id를 참조합니다.
    CONSTRAINT fk_project_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE project IS '프로젝트 정보 테이블';
COMMENT ON COLUMN project.id IS '프로젝트 고유 ID (PK)';
COMMENT ON COLUMN project.name IS '프로젝트 이름';
COMMENT ON COLUMN project.description IS '프로젝트 설명';
COMMENT ON COLUMN project.creator_id IS '프로젝트 생성자 (User 테이블 FK)';
COMMENT ON COLUMN project.created_at IS '프로젝트 생성 일시';
COMMENT ON COLUMN project.updated_at IS '프로젝트 수정 일시';


