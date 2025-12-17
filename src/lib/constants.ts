export const nations = [
  { code: 'KR', name: '한국 (Korea)', lang: 'ko', dial: '+82' },
  { code: 'JP', name: '일본 (Japan)', lang: 'ja', dial: '+81' },
  { code: 'CN', name: '중국 (China)', lang: 'zh', dial: '+86' },
  { code: 'US', name: '미국 (USA)', lang: 'en', dial: '+1' },
  { code: 'VN', name: '베트남 (Vietnam)', lang: 'vi', dial: '+84' },
  { code: 'TH', name: '태국 (Thailand)', lang: 'th', dial: '+66' },
  { code: 'FR', name: '프랑스 (France)', lang: 'fr', dial: '+33' },
  { code: 'DE', name: '독일 (Germany)', lang: 'de', dial: '+49' },
  { code: 'GB', name: '영국 (UK)', lang: 'en', dial: '+44' },
  { code: 'AU', name: '호주 (Australia)', lang: 'en', dial: '+61' },
  { code: 'PH', name: '필리핀 (Philippines)', lang: 'en', dial: '+63' },
  { code: 'ID', name: '인도네시아 (Indonesia)', lang: 'id', dial: '+62' },
  { code: 'MY', name: '말레이시아 (Malaysia)', lang: 'ms', dial: '+60' },
  { code: 'SG', name: '싱가포르 (Singapore)', lang: 'en', dial: '+65' },
  { code: 'IN', name: '인도 (India)', lang: 'en', dial: '+91' },
]

export const languages = [
  { code: 'ko', name: '한국어 (Korean)', icon: '가' },
  { code: 'en', name: 'English (영어)', icon: 'A' },
  { code: 'ja', name: '日本語 (Japanese)', icon: 'あ' },
  { code: 'zh', name: '中文 (Chinese)', icon: '文' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', icon: 'Vi' },
]

export const destinations = [
  { code: 'KR', name: '한국 (Korea)', ad: '무제한 데이터 유심' },
  { code: 'AU', name: '호주 (Australia)', ad: '호주 농장 장비 세트' },
  { code: 'JP', name: '일본 (Japan)', ad: '일본 워홀 포켓와이파이' },
  { code: 'CA', name: '캐나다 (Canada)', ad: '캐나다 유심 할인' },
  { code: 'NZ', name: '뉴질랜드 (New Zealand)', ad: '뉴질랜드 렌터카 할인' },
]

export const jobCategories = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'hotel', name: '호텔', nameEn: 'Hotel' },
  { id: 'farm', name: '농장', nameEn: 'Farm' },
  { id: 'restaurant', name: '식당', nameEn: 'Restaurant' },
  { id: 'cafe', name: '카페', nameEn: 'Cafe' },
  { id: 'factory', name: '공장', nameEn: 'Factory' },
  { id: 'convenience', name: '편의점', nameEn: 'Convenience' },
]

export const housingCategories = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'goshiwon', name: '고시원', nameEn: 'Goshiwon' },
  { id: 'sharehouse', name: '쉐어하우스', nameEn: 'Sharehouse' },
  { id: 'oneroom', name: '원룸', nameEn: 'One-room' },
  { id: 'officetel', name: '오피스텔', nameEn: 'Officetel' },
]

export const marketCategories = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'housing', name: '주거정보', nameEn: 'Housing' },
  { id: 'job', name: '일자리', nameEn: 'Jobs' },
  { id: 'visa', name: '비자/서류', nameEn: 'Visa/Docs' },
  { id: 'life', name: '생활정보', nameEn: 'Life Tips' },
]

export const communityCategories = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'free', name: '자유', nameEn: 'Free' },
  { id: 'question', name: '질문', nameEn: 'Q&A' },
  { id: 'info', name: '정보', nameEn: 'Info' },
  { id: 'meetup', name: '문화/모임', nameEn: 'Meetup' },
]

export const jobRatingLabels = {
  ko: ['급여', '분위기', '시설', '텃세', '업무'],
  en: ['Salary', 'Atmosphere', 'Facilities', 'Hazing', 'Workload'],
  ja: ['給料', '雰囲気', '施設', 'いじめ', '業務'],
  zh: ['工资', '氛围', '设施', '排挤', '工作量'],
  vi: ['Lương', 'Bầu không khí', 'Cơ sở', 'Bắt nạt', 'Khối lượng'],
}

export const housingRatingLabels = {
  ko: ['방음', '청결', '시설', '치안', '가격'],
  en: ['Soundproof', 'Cleanliness', 'Facilities', 'Safety', 'Price'],
  ja: ['防音', '清潔', '施設', '治安', '価格'],
  zh: ['隔音', '清洁', '设施', '治安', '价格'],
  vi: ['Cách âm', 'Sạch sẽ', 'Cơ sở', 'An ninh', 'Giá'],
}

export const sosCards = [
  {
    id: 'hospital',
    icon: 'Hospital',
    ko: '아파요. 병원 가주세요.',
    en: 'I am sick. Please take me to the hospital.',
    ja: '体が痛いです。病院に連れて行ってください。',
    zh: '我生病了，请带我去医院。',
    vi: 'Tôi bị ốm. Làm ơn đưa tôi đến bệnh viện.',
  },
  {
    id: 'pharmacy',
    icon: 'Pill',
    ko: '약국이 어디에 있나요?',
    en: 'Where is the pharmacy?',
    ja: '薬局はどこですか？',
    zh: '药店在哪里？',
    vi: 'Hiệu thuốc ở đâu?',
  },
  {
    id: 'wallet',
    icon: 'Shield',
    ko: '지갑을 잃어버렸어요.',
    en: 'I lost my wallet. Help me.',
    ja: '財布を失くしました。助けてください。',
    zh: '我丢了钱包，请帮帮我。',
    vi: 'Tôi bị mất ví. Hãy giúp tôi.',
  },
  {
    id: 'taxi',
    icon: 'Car',
    ko: '이 주소로 가주세요.',
    en: 'Please take me to this address.',
    ja: 'この住所へ行ってください。',
    zh: '请带我去这个地址。',
    vi: 'Làm ơn đưa tôi đến địa chỉ này.',
  },
]
