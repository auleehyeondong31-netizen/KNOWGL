import type { MarketItem, CommunityPost } from './types'

// 국가별 마켓 아이템
export const marketItemsByCountry: Record<string, MarketItem[]> = {
  kr: [
    { id: 1, title: '한국 비자 완벽 가이드 (D-2, E-7)', category: 'visa', price: 5000, rating: 4.8, reviews: 234, views: 1520, likes: 89, seller: '비자전문가', thumbnail: '📄', description: 'D-2, E-7 비자 신청부터 연장까지 모든 과정을 상세히 설명합니다.' },
    { id: 2, title: '서울 원룸 계약 체크리스트', category: 'housing', price: 3000, rating: 4.5, reviews: 156, views: 980, likes: 67, seller: '부동산마스터', thumbnail: '🏠', description: '외국인이 한국에서 원룸 계약 시 꼭 확인해야 할 체크리스트입니다.' },
    { id: 3, title: '한국어 직장 용어 100선', category: 'job', price: 2000, rating: 4.7, reviews: 312, views: 2100, likes: 145, seller: '취업멘토', thumbnail: '💼', description: '한국 직장에서 자주 사용하는 비즈니스 용어 100개를 정리했습니다.' },
    { id: 4, title: '외국인 생활 꿀팁 모음', category: 'life', price: 0, rating: 4.3, reviews: 89, views: 650, likes: 34, seller: '한국생활러', thumbnail: '✨', description: '한국 생활 5년차가 알려주는 생활 꿀팁 모음입니다.' },
  ],
  jp: [
    { id: 1, title: '日本ビザ完全ガイド', category: 'visa', price: 500, rating: 4.9, reviews: 178, views: 1200, likes: 92, seller: 'ビザ専門家', thumbnail: '📄', description: '日本のビザ申請から更新まで詳しく説明します。' },
    { id: 2, title: '東京ワンルーム契約チェックリスト', category: 'housing', price: 300, rating: 4.6, reviews: 134, views: 890, likes: 56, seller: '不動産マスター', thumbnail: '🏠', description: '外国人が日本でワンルームを契約する際の注意点です。' },
    { id: 3, title: '日本語ビジネス用語100選', category: 'job', price: 200, rating: 4.8, reviews: 267, views: 1800, likes: 123, seller: '就職メンター', thumbnail: '💼', description: '日本の職場でよく使うビジネス用語100個をまとめました。' },
  ],
  au: [
    { id: 1, title: 'Australia Visa Complete Guide', category: 'visa', price: 15, rating: 4.7, reviews: 145, views: 980, likes: 78, seller: 'VisaExpert', thumbnail: '📄', description: 'Complete guide for Australian visa application and extension.' },
    { id: 2, title: 'Sydney Apartment Rental Checklist', category: 'housing', price: 10, rating: 4.5, reviews: 98, views: 670, likes: 45, seller: 'PropertyPro', thumbnail: '🏠', description: 'Essential checklist for renting an apartment in Sydney.' },
    { id: 3, title: 'Australian Workplace Phrases', category: 'job', price: 8, rating: 4.6, reviews: 189, views: 1340, likes: 89, seller: 'CareerCoach', thumbnail: '💼', description: '100 common workplace phrases used in Australian offices.' },
  ],
}

// 국가별 커뮤니티 게시글
export const postsByCountry: Record<string, CommunityPost[]> = {
  kr: [
    { id: 1, title: '한국에서 첫 직장 구하기 팁 공유합니다!', category: 'info', content: '안녕하세요! 저는 베트남에서 온 유학생인데요. 한국에서 첫 직장을 구하면서 겪은 경험과 팁을 공유하고 싶어서 글을 씁니다.', author: '베트남친구', authorCountry: 'Vietnam', likes: 45, comments: 23, views: 320, createdAt: '2시간 전', isPinned: true },
    { id: 2, title: '서울 맛집 추천해주세요~', category: 'free', content: '이번 주말에 친구들이랑 서울 놀러가는데 맛있는 음식점 추천해주세요!', author: 'JohnDoe', authorCountry: 'USA', likes: 12, comments: 34, views: 180, createdAt: '5시간 전', isPinned: false },
    { id: 3, title: 'E-7 비자 변경 질문이요', category: 'question', content: 'D-2 비자에서 E-7으로 변경하려고 하는데 필요한 서류가 뭔지 잘 모르겠어요.', author: '취준생', authorCountry: 'China', likes: 8, comments: 15, views: 95, createdAt: '1일 전', isPinned: false },
    { id: 4, title: '이번 주 토요일 홍대 모임 있어요!', category: 'meetup', content: '외국인 친구들 모여서 같이 놀아요~ 장소는 홍대입구역 근처 카페이고, 오후 3시에 만나요!', author: '모임장', authorCountry: 'Japan', likes: 67, comments: 42, views: 520, createdAt: '3일 전', isPinned: false },
  ],
  jp: [
    { id: 1, title: '日本で仕事を探すコツを共有します！', category: 'info', content: 'こんにちは！私は韓国から来た留学生です。日本で就職活動をした経験を共有したいと思います。', author: '韓国人留学生', authorCountry: 'Korea', likes: 52, comments: 28, views: 380, createdAt: '3時間前', isPinned: true },
    { id: 2, title: '東京のおすすめラーメン店教えてください', category: 'free', content: '今週末友達と東京に行くんですが、おいしいラーメン屋さんを教えてください！', author: 'TomSmith', authorCountry: 'USA', likes: 18, comments: 45, views: 210, createdAt: '6時間前', isPinned: false },
    { id: 3, title: 'ワーホリビザの質問です', category: 'question', content: 'ワーキングホリデービザの申請方法について教えてください。', author: '旅行者', authorCountry: 'Australia', likes: 15, comments: 22, views: 145, createdAt: '1日前', isPinned: false },
  ],
  au: [
    { id: 1, title: 'Tips for finding your first job in Australia!', category: 'info', content: "Hi everyone! I'm sharing my experience of finding a job in Australia as an international student.", author: 'KoreanStudent', authorCountry: 'Korea', likes: 38, comments: 19, views: 290, createdAt: '2 hours ago', isPinned: true },
    { id: 2, title: 'Best cafes in Sydney?', category: 'free', content: "I'm visiting Sydney this weekend with friends. Any cafe recommendations?", author: 'JapanTraveler', authorCountry: 'Japan', likes: 22, comments: 31, views: 195, createdAt: '5 hours ago', isPinned: false },
    { id: 3, title: 'Working Holiday Visa Question', category: 'question', content: 'Does anyone know how to extend the working holiday visa?', author: 'Backpacker', authorCountry: 'Germany', likes: 11, comments: 18, views: 120, createdAt: '1 day ago', isPinned: false },
  ],
}

// 국가별 통화 기호
export function getCurrencySymbol(countryCode: string): string {
  switch (countryCode) {
    case 'kr': return '₩'
    case 'jp': return '¥'
    case 'au': case 'us': case 'ca': case 'sg': return '$'
    default: return '₩'
  }
}

// 카테고리 색상
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'free': return 'bg-gray-100 text-gray-600'
    case 'question': return 'bg-blue-100 text-blue-600'
    case 'info': return 'bg-emerald-100 text-emerald-600'
    case 'meetup': return 'bg-rose-100 text-rose-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}
