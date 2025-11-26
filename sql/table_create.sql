-- 1) 홈·카테고리 ENUM 타입 (필요 시 재사용 가능)
CREATE TYPE homepage_type AS ENUM ('freeconvert', 'freerecord');
CREATE TYPE category_type AS ENUM ('공지', '뉴스', '이벤트', '기타');

-- 2) 블로그 공지 테이블
CREATE TABLE blog_notices (
  id            BIGSERIAL PRIMARY KEY,
  homepage      homepage_type       NOT NULL,
  category      category_type       NOT NULL,
  created_at    DATE                NOT NULL,
  highlight     BOOLEAN             NOT NULL DEFAULT FALSE,
  title         VARCHAR(200)        NOT NULL,
  content       TEXT                NOT NULL,

  -- 감사 로그나 정렬이 필요하면 추가 (예: 생성 일시)
  inserted_at   TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- 3) 업데이트 시각 자동 갱신 (선택)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_notices_set_updated_at
BEFORE UPDATE ON blog_notices
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();