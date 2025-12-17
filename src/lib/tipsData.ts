// 국가별 생활 팁 데이터

export interface Tip {
  id: string
  category: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  icon: string
  important?: boolean
}

export interface TipCategory {
  id: string
  name: string
  nameEn: string
  icon: string
  color: string
}

export const tipCategories: TipCategory[] = [
  { id: 'visa', name: '비자/체류', nameEn: 'Visa/Stay', icon: '🛂', color: 'indigo' },
  { id: 'housing', name: '주거', nameEn: 'Housing', icon: '🏠', color: 'emerald' },
  { id: 'transport', name: '교통', nameEn: 'Transport', icon: '🚇', color: 'blue' },
  { id: 'medical', name: '의료', nameEn: 'Medical', icon: '🏥', color: 'red' },
  { id: 'finance', name: '금융', nameEn: 'Finance', icon: '💰', color: 'amber' },
  { id: 'culture', name: '문화', nameEn: 'Culture', icon: '🎌', color: 'purple' },
  { id: 'work', name: '취업', nameEn: 'Work', icon: '💼', color: 'slate' },
  { id: 'daily', name: '일상생활', nameEn: 'Daily Life', icon: '☀️', color: 'orange' },
]

export const tipsByCountry: Record<string, Tip[]> = {
  kr: [
    // 비자/체류
    { id: 'kr-visa-1', category: 'visa', title: '외국인등록증 필수 발급', titleEn: 'Alien Registration Card Required', content: '입국 후 90일 이상 체류 시 반드시 외국인등록증을 발급받아야 합니다. 가까운 출입국관리사무소에서 신청하세요.', contentEn: 'If staying more than 90 days, you must obtain an Alien Registration Card. Apply at your nearest immigration office.', icon: '🪪', important: true },
    { id: 'kr-visa-2', category: 'visa', title: '비자 연장은 만료 1개월 전', titleEn: 'Extend visa 1 month before expiry', content: '비자 연장은 만료일 1개월 전부터 가능합니다. 하이코리아(Hi Korea) 웹사이트에서 온라인 예약 후 방문하세요.', contentEn: 'Visa extension can be done 1 month before expiry. Make an online reservation on Hi Korea website before visiting.', icon: '📅' },
    
    // 주거
    { id: 'kr-housing-1', category: 'housing', title: '전세/월세 제도 이해하기', titleEn: 'Understanding Jeonse/Wolse', content: '한국은 전세(목돈 보증금)와 월세(매달 임대료) 제도가 있습니다. 외국인은 주로 월세를 선택합니다.', contentEn: 'Korea has Jeonse (large deposit) and Wolse (monthly rent) systems. Foreigners usually choose Wolse.', icon: '🔑', important: true },
    { id: 'kr-housing-2', category: 'housing', title: '부동산 중개 수수료', titleEn: 'Real Estate Commission', content: '부동산 중개 수수료는 보통 월세의 0.5개월분입니다. 계약 전 반드시 확인하세요.', contentEn: 'Real estate commission is usually 0.5 months rent. Always confirm before signing.', icon: '💵' },
    { id: 'kr-housing-3', category: 'housing', title: '분리수거 필수', titleEn: 'Recycling is mandatory', content: '한국은 분리수거가 필수입니다. 일반쓰레기, 음식물쓰레기, 재활용품을 구분해서 버려야 합니다.', contentEn: 'Recycling is mandatory in Korea. Separate general waste, food waste, and recyclables.', icon: '♻️' },
    
    // 교통
    { id: 'kr-transport-1', category: 'transport', title: '교통카드 필수', titleEn: 'Transportation Card Essential', content: 'T-money나 캐시비 교통카드를 구입하세요. 지하철, 버스 환승 할인을 받을 수 있습니다.', contentEn: 'Get a T-money or Cashbee card. You can get transfer discounts on subway and bus.', icon: '💳', important: true },
    { id: 'kr-transport-2', category: 'transport', title: '카카오맵/네이버맵 활용', titleEn: 'Use Kakao Map/Naver Map', content: '구글맵보다 카카오맵이나 네이버맵이 한국에서 더 정확합니다. 대중교통 경로 검색에 필수!', contentEn: 'Kakao Map or Naver Map is more accurate than Google Maps in Korea. Essential for public transport!', icon: '🗺️' },
    { id: 'kr-transport-3', category: 'transport', title: '택시 앱 사용', titleEn: 'Use Taxi Apps', content: '카카오T 앱으로 택시를 호출하면 편리합니다. 목적지를 미리 입력하면 의사소통 걱정 없어요.', contentEn: 'Use Kakao T app to call taxis. Enter destination in advance to avoid communication issues.', icon: '🚕' },
    
    // 의료
    { id: 'kr-medical-1', category: 'medical', title: '국민건강보험 가입', titleEn: 'National Health Insurance', content: '6개월 이상 체류하는 외국인은 국민건강보험에 의무 가입해야 합니다. 의료비가 크게 절감됩니다.', contentEn: 'Foreigners staying over 6 months must enroll in National Health Insurance. It significantly reduces medical costs.', icon: '🏥', important: true },
    { id: 'kr-medical-2', category: 'medical', title: '약국에서 간단한 약 구입', titleEn: 'Buy medicine at pharmacy', content: '감기약, 소화제 등 간단한 약은 처방전 없이 약국에서 구입할 수 있습니다.', contentEn: 'Simple medicines like cold medicine can be bought at pharmacies without prescription.', icon: '💊' },
    
    // 금융
    { id: 'kr-finance-1', category: 'finance', title: '은행 계좌 개설', titleEn: 'Open Bank Account', content: '외국인등록증이 있으면 은행 계좌를 개설할 수 있습니다. 카카오뱅크, 토스뱅크는 앱으로 쉽게 개설 가능합니다.', contentEn: 'You can open a bank account with your ARC. Kakao Bank and Toss Bank can be opened easily via app.', icon: '🏦', important: true },
    { id: 'kr-finance-2', category: 'finance', title: '카카오페이/네이버페이 활용', titleEn: 'Use Kakao Pay/Naver Pay', content: '한국에서는 모바일 결제가 매우 활성화되어 있습니다. 카카오페이나 네이버페이를 연동하면 편리합니다.', contentEn: 'Mobile payment is very popular in Korea. Link Kakao Pay or Naver Pay for convenience.', icon: '📱' },
    
    // 문화
    { id: 'kr-culture-1', category: 'culture', title: '나이와 존댓말', titleEn: 'Age and Honorifics', content: '한국에서는 나이가 중요합니다. 처음 만나는 사람에게는 존댓말을 사용하고, 나이를 물어보는 것이 일반적입니다.', contentEn: 'Age is important in Korea. Use honorifics with strangers, and asking age is common.', icon: '🙏' },
    { id: 'kr-culture-2', category: 'culture', title: '신발 벗기', titleEn: 'Remove Shoes', content: '한국 가정이나 일부 식당에서는 신발을 벗고 들어갑니다. 깨끗한 양말을 준비하세요!', contentEn: 'Remove shoes when entering Korean homes and some restaurants. Keep clean socks!', icon: '👟' },
    
    // 취업
    { id: 'kr-work-1', category: 'work', title: '취업비자 확인', titleEn: 'Check Work Visa', content: '외국인이 한국에서 일하려면 적절한 취업비자(E-7, H-1 등)가 필요합니다. 불법 취업은 강제 출국 사유입니다.', contentEn: 'Foreigners need proper work visa (E-7, H-1, etc.) to work in Korea. Illegal work leads to deportation.', icon: '📋', important: true },
    { id: 'kr-work-2', category: 'work', title: '4대 보험', titleEn: 'Four Major Insurances', content: '정규직으로 취업하면 4대 보험(국민연금, 건강보험, 고용보험, 산재보험)에 가입됩니다.', contentEn: 'Full-time employees are enrolled in four major insurances (pension, health, employment, industrial accident).', icon: '🛡️' },
    
    // 일상생활
    { id: 'kr-daily-1', category: 'daily', title: '배달 앱 활용', titleEn: 'Use Delivery Apps', content: '배달의민족, 쿠팡이츠 등 배달 앱으로 음식, 생필품을 편리하게 주문할 수 있습니다.', contentEn: 'Use delivery apps like Baedal Minjok, Coupang Eats for food and daily necessities.', icon: '🛵' },
    { id: 'kr-daily-2', category: 'daily', title: '편의점 24시간', titleEn: '24-hour Convenience Stores', content: 'CU, GS25, 세븐일레븐 등 편의점이 24시간 운영됩니다. 간단한 식사, ATM, 택배 등 다양한 서비스 이용 가능합니다.', contentEn: 'Convenience stores like CU, GS25, 7-Eleven are open 24 hours. Use for meals, ATM, delivery, etc.', icon: '🏪' },
  ],
  
  jp: [
    // 비자/체류
    { id: 'jp-visa-1', category: 'visa', title: '在留カードの携帯義務', titleEn: 'Carry Residence Card', content: '在留カードは常に携帯する必要があります。14日以内に住所変更届も忘れずに。', contentEn: 'Always carry your Residence Card. Don\'t forget to report address change within 14 days.', icon: '🪪', important: true },
    { id: 'jp-visa-2', category: 'visa', title: '再入国許可', titleEn: 'Re-entry Permit', content: '1年以内に日本に戻る場合は「みなし再入国許可」で出国できます。それ以上の場合は再入国許可が必要です。', contentEn: 'If returning within 1 year, you can use "deemed re-entry permit". Otherwise, apply for re-entry permit.', icon: '✈️' },
    
    // 주거
    { id: 'jp-housing-1', category: 'housing', title: '敷金・礼金・仲介手数料', titleEn: 'Deposit, Key Money, Commission', content: '日本の賃貸は初期費用が高いです。敷金(1-2ヶ月)、礼金(1-2ヶ月)、仲介手数料が必要です。', contentEn: 'Japanese rentals have high initial costs. Expect deposit (1-2 months), key money (1-2 months), and commission.', icon: '💴', important: true },
    { id: 'jp-housing-2', category: 'housing', title: 'ゴミ分別ルール', titleEn: 'Garbage Separation Rules', content: '日本のゴミ分別は厳格です。地域によってルールが異なるので、必ず確認してください。', contentEn: 'Japan has strict garbage separation rules. Rules vary by area, so always check.', icon: '♻️' },
    
    // 교통
    { id: 'jp-transport-1', category: 'transport', title: 'Suica/Pasmo카드', titleEn: 'Suica/Pasmo Card', content: 'SuicaやPasmoなどのICカードは電車、バス、コンビニでも使えます。必ず用意しましょう。', contentEn: 'IC cards like Suica or Pasmo work on trains, buses, and convenience stores. Essential to have.', icon: '💳', important: true },
    { id: 'jp-transport-2', category: 'transport', title: '電車のマナー', titleEn: 'Train Manners', content: '電車内では通話禁止、優先席付近では携帯電話の電源オフが基本マナーです。', contentEn: 'No phone calls on trains. Turn off phones near priority seats as basic manners.', icon: '🚃' },
    
    // 의료
    { id: 'jp-medical-1', category: 'medical', title: '国民健康保険加入', titleEn: 'National Health Insurance', content: '3ヶ月以上滞在する外国人は国民健康保険に加入義務があります。医療費の70%がカバーされます。', contentEn: 'Foreigners staying over 3 months must enroll in National Health Insurance. 70% of medical costs covered.', icon: '🏥', important: true },
    
    // 금융
    { id: 'jp-finance-1', category: 'finance', title: '銀行口座開設', titleEn: 'Open Bank Account', content: 'ゆうちょ銀行が外国人に開設しやすいです。在留カードと印鑑が必要です。', contentEn: 'Japan Post Bank is easier for foreigners to open. Need Residence Card and seal.', icon: '🏦', important: true },
    { id: 'jp-finance-2', category: 'finance', title: '現金社会', titleEn: 'Cash Society', content: '日本はまだ現金払いが多いです。常に現金を持ち歩くことをお勧めします。', contentEn: 'Japan still uses cash a lot. Always carry some cash with you.', icon: '💵' },
    
    // 문화
    { id: 'jp-culture-1', category: 'culture', title: 'お辞儀の文化', titleEn: 'Bowing Culture', content: '日本ではお辞儀が重要です。挨拶、感謝、謝罪の時にお辞儀をします。', contentEn: 'Bowing is important in Japan. Bow when greeting, thanking, or apologizing.', icon: '🙇' },
    { id: 'jp-culture-2', category: 'culture', title: '靴を脱ぐ場所', titleEn: 'Where to Remove Shoes', content: '家、旅館、一部のレストランでは靴を脱ぎます。段差があるところは脱ぐサインです。', contentEn: 'Remove shoes at homes, ryokans, and some restaurants. A step up indicates shoes off area.', icon: '👟' },
    
    // 일상생활
    { id: 'jp-daily-1', category: 'daily', title: 'コンビニ活用', titleEn: 'Use Convenience Stores', content: 'コンビニでは食事、ATM、宅配便、公共料金支払いなど多くのサービスが利用できます。', contentEn: 'Convenience stores offer meals, ATM, delivery, utility payments, and more.', icon: '🏪' },
    { id: 'jp-daily-2', category: 'daily', title: '100円ショップ', titleEn: '100 Yen Shops', content: 'ダイソー、セリアなどの100円ショップで生活用品を安く揃えられます。', contentEn: 'Get daily necessities cheaply at 100 yen shops like Daiso, Seria.', icon: '🛒' },
  ],
  
  au: [
    // 비자
    { id: 'au-visa-1', category: 'visa', title: 'Visa Conditions', titleEn: 'Visa Conditions', content: 'Check your visa conditions on VEVO. Working hours limits and study requirements vary by visa type.', contentEn: 'Check your visa conditions on VEVO. Working hours limits and study requirements vary by visa type.', icon: '🪪', important: true },
    { id: 'au-visa-2', category: 'visa', title: 'Medicare Eligibility', titleEn: 'Medicare Eligibility', content: 'Some visa holders from reciprocal countries can access Medicare. Check if your country has an agreement.', contentEn: 'Some visa holders from reciprocal countries can access Medicare. Check if your country has an agreement.', icon: '🏥' },
    
    // 주거
    { id: 'au-housing-1', category: 'housing', title: 'Bond and Rent', titleEn: 'Bond and Rent', content: 'Bond is usually 4 weeks rent. Rent is typically paid fortnightly or monthly in advance.', contentEn: 'Bond is usually 4 weeks rent. Rent is typically paid fortnightly or monthly in advance.', icon: '🏠', important: true },
    { id: 'au-housing-2', category: 'housing', title: 'Flatmates.com.au', titleEn: 'Find Shared Housing', content: 'Use Flatmates.com.au or Gumtree to find share houses. Inspect before paying any money.', contentEn: 'Use Flatmates.com.au or Gumtree to find share houses. Inspect before paying any money.', icon: '🔍' },
    
    // 교통
    { id: 'au-transport-1', category: 'transport', title: 'Opal/Myki Card', titleEn: 'Transport Cards', content: 'Get an Opal card (Sydney) or Myki (Melbourne) for public transport. Tap on and off!', contentEn: 'Get an Opal card (Sydney) or Myki (Melbourne) for public transport. Tap on and off!', icon: '💳', important: true },
    { id: 'au-transport-2', category: 'transport', title: 'Drive on the Left', titleEn: 'Drive on the Left', content: 'Australia drives on the left side. You may need to convert your license depending on your visa.', contentEn: 'Australia drives on the left side. You may need to convert your license depending on your visa.', icon: '🚗' },
    
    // 의료
    { id: 'au-medical-1', category: 'medical', title: 'Overseas Health Cover', titleEn: 'OSHC Required', content: 'Student visa holders must have Overseas Student Health Cover (OSHC) for the entire visa duration.', contentEn: 'Student visa holders must have Overseas Student Health Cover (OSHC) for the entire visa duration.', icon: '🏥', important: true },
    
    // 금융
    { id: 'au-finance-1', category: 'finance', title: 'Open Bank Account', titleEn: 'Open Bank Account', content: 'Open a bank account within 6 weeks of arrival with just your passport. After that, you need more ID.', contentEn: 'Open a bank account within 6 weeks of arrival with just your passport. After that, you need more ID.', icon: '🏦', important: true },
    { id: 'au-finance-2', category: 'finance', title: 'Tax File Number', titleEn: 'Get TFN', content: 'Apply for a Tax File Number (TFN) online. Without it, you\'ll be taxed at the highest rate.', contentEn: 'Apply for a Tax File Number (TFN) online. Without it, you\'ll be taxed at the highest rate.', icon: '📋' },
    
    // 취업
    { id: 'au-work-1', category: 'work', title: 'Work Rights', titleEn: 'Know Your Work Rights', content: 'Minimum wage is around $23/hour. Keep records of your work hours and pay.', contentEn: 'Minimum wage is around $23/hour. Keep records of your work hours and pay.', icon: '💼', important: true },
    { id: 'au-work-2', category: 'work', title: 'Superannuation', titleEn: 'Superannuation', content: 'Employers must pay 11% super on top of your wage. You can claim it back when leaving Australia.', contentEn: 'Employers must pay 11% super on top of your wage. You can claim it back when leaving Australia.', icon: '💰' },
    
    // 일상
    { id: 'au-daily-1', category: 'daily', title: 'Sun Safety', titleEn: 'Sun Protection', content: 'Australian sun is very strong. Always wear sunscreen (SPF 50+), hat, and sunglasses outdoors.', contentEn: 'Australian sun is very strong. Always wear sunscreen (SPF 50+), hat, and sunglasses outdoors.', icon: '☀️', important: true },
    { id: 'au-daily-2', category: 'daily', title: 'Woolworths & Coles', titleEn: 'Major Supermarkets', content: 'Woolworths and Coles are the main supermarkets. Aldi is cheaper for basics.', contentEn: 'Woolworths and Coles are the main supermarkets. Aldi is cheaper for basics.', icon: '🛒' },
  ],
}

export function getTipsByCountry(countryCode: string): Tip[] {
  return tipsByCountry[countryCode] || tipsByCountry['kr']
}

export function getTipsByCategory(countryCode: string, categoryId: string): Tip[] {
  const tips = getTipsByCountry(countryCode)
  if (categoryId === 'all') return tips
  return tips.filter(tip => tip.category === categoryId)
}

export function getImportantTips(countryCode: string): Tip[] {
  return getTipsByCountry(countryCode).filter(tip => tip.important)
}
