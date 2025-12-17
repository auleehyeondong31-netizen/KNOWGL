// 지원 국가 목록
export const countries = [
  { 
    code: 'kr', 
    name: '대한민국', 
    nameEn: 'South Korea',
    flag: '🇰🇷',
    defaultLang: 'ko',
    currency: 'KRW',
    cities: ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '제주']
  },
  { 
    code: 'jp', 
    name: '일본', 
    nameEn: 'Japan',
    flag: '🇯🇵',
    defaultLang: 'ja',
    currency: 'JPY',
    cities: ['東京', '大阪', '京都', '福岡', '札幌', '名古屋', '横浜']
  },
  { 
    code: 'tw', 
    name: '대만', 
    nameEn: 'Taiwan',
    flag: '🇹🇼',
    defaultLang: 'zh',
    currency: 'TWD',
    cities: ['台北', '高雄', '台中', '台南', '桃園']
  },
  { 
    code: 'au', 
    name: '호주', 
    nameEn: 'Australia',
    flag: '🇦🇺',
    defaultLang: 'en',
    currency: 'AUD',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  },
  { 
    code: 'ca', 
    name: '캐나다', 
    nameEn: 'Canada',
    flag: '🇨🇦',
    defaultLang: 'en',
    currency: 'CAD',
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa']
  },
  { 
    code: 'us', 
    name: '미국', 
    nameEn: 'United States',
    flag: '🇺🇸',
    defaultLang: 'en',
    currency: 'USD',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco']
  },
  { 
    code: 'sg', 
    name: '싱가포르', 
    nameEn: 'Singapore',
    flag: '🇸🇬',
    defaultLang: 'en',
    currency: 'SGD',
    cities: ['Singapore']
  },
] as const

export type CountryCode = typeof countries[number]['code']

export function getCountryByCode(code: string) {
  return countries.find(c => c.code === code)
}

export function getCountryName(code: string, lang: string = 'ko') {
  const country = getCountryByCode(code)
  if (!country) return code
  return lang === 'ko' ? country.name : country.nameEn
}
