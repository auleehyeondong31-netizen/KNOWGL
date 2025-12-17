-- KNOWGL Places 테이블 스키마
-- Supabase SQL Editor에서 실행하세요

-- places 테이블 생성
CREATE TABLE IF NOT EXISTS places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('job', 'housing', 'amenity')),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  short_review TEXT,
  address TEXT NOT NULL,
  location TEXT, -- 지역구 (강남구, 마포구 등)
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  avg_rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  -- Job-specific fields
  work_hours TEXT,
  benefits TEXT[],
  -- Housing-specific fields
  deposit TEXT,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 (Row Level Security)
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 places 읽기 가능
CREATE POLICY "Anyone can read places" ON places
  FOR SELECT USING (true);

-- 인증된 사용자만 places 추가 가능 (관리자 전용으로 변경 가능)
CREATE POLICY "Authenticated users can insert places" ON places
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_places_type ON places(type);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_location ON places(location);
CREATE INDEX IF NOT EXISTS idx_places_rating ON places(avg_rating DESC);

-- 샘플 데이터 삽입 (일자리)
INSERT INTO places (type, name, category, subtitle, short_review, address, location, lat, lng, image_url, tags, avg_rating, review_count, work_hours, benefits)
VALUES 
  ('job', '스타벅스 강남역점', 'cafe', '바리스타 - 시급 12,000원', '직원 분위기 좋고 외국인 응대 매뉴얼이 잘 되어 있어요.', '서울 강남구 강남대로 396', '강남구', 37.498, 127.028, 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400', ARRAY['외국인 환영', '한국어 초급 OK'], 4.8, 128, '09:00 - 18:00', ARRAY['4대보험', '식사제공']),
  ('job', '이태원 이탈리안 레스토랑', 'restaurant', '서버 - 시급 11,000원', '피크타임은 바쁘지만 팁이 괜찮고 영어로도 소통 가능해요.', '서울 용산구 이태원로 123', '용산구', 37.534, 126.994, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', ARRAY['영어 가능', '팁 별도'], 4.6, 67, '11:00 - 22:00', ARRAY['식사제공', '교통비']),
  ('job', '명동 편의점 GS25', 'retail', '야간 알바 - 시급 13,000원', '야간은 조용한 편이고 업무 루틴이 단순해 적응이 쉬워요.', '서울 중구 명동길 45', '중구', 37.563, 126.985, 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400', ARRAY['야간 근무', '주 3일 가능'], 4.3, 156, '22:00 - 06:00', ARRAY['야간수당']),
  ('job', '홍대 블루보틀', 'cafe', '바리스타 - 시급 11,500원', '교육 체계가 좋아 커피 초보도 배우면서 일할 수 있어요.', '서울 마포구 양화로 188', '마포구', 37.556, 126.923, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', ARRAY['외국인 환영', '영어 가능'], 4.7, 89, '08:00 - 17:00', ARRAY['4대보험', '커피 무료']),
  ('job', '신라호텔 프론트', 'hotel', '프론트 데스크 - 월급 280만원', '복지 좋고 커리어에 도움되지만 영어 응대 강도가 높아요.', '서울 중구 동호로 249', '중구', 37.556, 127.005, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', ARRAY['영어 필수', '정규직'], 4.9, 45, '교대근무', ARRAY['4대보험', '숙소제공', '식사제공']),
  ('job', '김포 전자부품 공장', 'factory', '생산직 - 시급 12,500원', '기숙사 제공이라 편하지만 라인이면 체력이 꽤 필요해요.', '경기 김포시 양촌읍 공장로 100', '강서구', 37.615, 126.715, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', ARRAY['숙소제공', '한국어 불필요'], 4.2, 234, '08:00 - 17:00', ARRAY['4대보험', '숙소제공', '식사제공']);

-- 샘플 데이터 삽입 (주거)
INSERT INTO places (type, name, category, subtitle, short_review, address, location, lat, lng, image_url, tags, avg_rating, review_count, deposit, size)
VALUES 
  ('housing', '홍대 모던 쉐어하우스', 'sharehouse', '1인실 - 월 45만원', '관리 잘 되어 있고 공용공간이 깨끗해서 만족도가 높아요.', '서울 마포구 와우산로 94', '마포구', 37.556, 126.923, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', ARRAY['외국인 전용', '풀옵션'], 4.9, 89, '100만원', '10㎡'),
  ('housing', '신촌 코지 원룸', 'oneroom', '원룸 - 월 55만원', '역이 가깝고 방음 괜찮아요. 다만 주차는 어려워요.', '서울 서대문구 연세로 50', '서대문구', 37.558, 126.936, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', ARRAY['역세권', '보증금 낮음'], 4.7, 45, '500만원', '20㎡'),
  ('housing', '건대입구 고시원', 'goshiwon', '고시원 - 월 35만원', '가격 대비 무난하지만 샤워실 혼잡 시간대가 있어요.', '서울 광진구 능동로 120', '광진구', 37.540, 127.070, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400', ARRAY['즉시입주', '공과금 포함'], 4.1, 34, '없음', '6㎡'),
  ('housing', '강남 럭셔리 오피스텔', 'officetel', '오피스텔 - 월 90만원', '교통/편의시설 최고인데 관리비가 높은 편이에요.', '서울 강남구 테헤란로 152', '강남구', 37.500, 127.036, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', ARRAY['신축', '풀옵션'], 4.8, 56, '1000만원', '33㎡');

-- 샘플 데이터 삽입 (편의시설)
INSERT INTO places (type, name, category, subtitle, short_review, address, location, lat, lng, image_url, tags, avg_rating, review_count)
VALUES 
  ('amenity', '이마트 강남점', 'mart', '대형마트 - 24시간', '새벽에도 운영해서 급할 때 좋아요. 주차는 주말에 혼잡해요.', '서울 강남구 봉은사로 176', '강남구', 37.495, 127.030, 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400', ARRAY['24시간', '주차가능'], 4.5, 320),
  ('amenity', '세브란스 병원', 'hospital', '종합병원 - 외국어 가능', '진료는 만족하지만 접수/대기 시간이 길 수 있어요.', '서울 서대문구 연세로 50-1', '서대문구', 37.560, 126.940, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400', ARRAY['영어 가능', '응급실'], 4.8, 567),
  ('amenity', '하나은행 홍대점', 'bank', '은행 - 외국인 계좌 개설', '외국인 창구가 있어 안내가 친절해요. 점심시간엔 붐벼요.', '서울 마포구 양화로 160', '마포구', 37.555, 126.925, 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400', ARRAY['외국인 전용 창구', '영어 가능'], 4.3, 89);

-- =====================================================
-- reviews 테이블 (리뷰 기능)
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  rating_details JSONB DEFAULT '{}',
  content TEXT NOT NULL,
  ai_summary TEXT,
  helpful_count INTEGER DEFAULT 0,
  author_name TEXT,
  author_country TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 리뷰 읽기 가능
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- 인증된 사용자만 리뷰 작성 가능
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 자신의 리뷰만 수정/삭제 가능
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_place_id ON reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);

-- =====================================================
-- profiles 테이블 (사용자 프로필 및 멤버십)
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  nationality TEXT,
  language TEXT DEFAULT 'ko',
  destination TEXT,
  -- 멤버십 관련
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMP WITH TIME ZONE,
  premium_plan TEXT CHECK (premium_plan IN ('monthly', 'yearly')),
  -- 통계
  ai_translation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 프로필 읽기 가능
CREATE POLICY "Anyone can read profiles" ON profiles
  FOR SELECT USING (true);

-- 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 자신의 프로필만 삽입 가능
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON profiles(is_premium);

-- 새 사용자 가입 시 자동으로 profiles 생성하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 (이미 존재하면 무시)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- community_posts 테이블 (커뮤니티 게시글)
-- =====================================================

CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL DEFAULT 'kr',
  category TEXT NOT NULL DEFAULT 'free',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 게시글 읽기 가능 (삭제되지 않은 것만)
CREATE POLICY "Anyone can read posts" ON community_posts
  FOR SELECT USING (is_deleted = false);

-- 인증된 사용자만 게시글 작성 가능
CREATE POLICY "Authenticated users can insert posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 자신의 게시글만 수정 가능
CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- 자신의 게시글만 삭제 가능
CREATE POLICY "Users can delete own posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_community_posts_country ON community_posts(country);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);

-- =====================================================
-- community_comments 테이블 (댓글)
-- =====================================================

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" ON community_comments
  FOR SELECT USING (is_deleted = false);

CREATE POLICY "Authenticated users can insert comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON community_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON community_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
