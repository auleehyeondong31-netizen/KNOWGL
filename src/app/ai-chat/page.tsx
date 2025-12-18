'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Send, Bot, User, Loader2, Sparkles, 
  FileText, Globe, Calendar, AlertCircle, CheckCircle,
  ChevronDown, Copy, RefreshCw
} from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const quickQuestions = [
  { ko: '워킹홀리데이 비자 신청 방법', en: 'How to apply for Working Holiday visa' },
  { ko: '학생 비자 연장하는 방법', en: 'How to extend student visa' },
  { ko: '취업 비자 자격 요건', en: 'Work visa eligibility requirements' },
  { ko: '비자 만료 시 할일', en: 'What to do when visa expires' },
]

const visaTypes = [
  { id: 'whv', name: '워킹홀리데이', nameEn: 'Working Holiday' },
  { id: 'student', name: '학생비자', nameEn: 'Student Visa' },
  { id: 'work', name: '취업비자', nameEn: 'Work Visa' },
  { id: 'tourist', name: '관광비자', nameEn: 'Tourist Visa' },
  { id: 'other', name: '기타', nameEn: 'Other' },
]

// AI 응답 생성 (실제로는 GPT API 연동)
function generateAIResponse(question: string, visaType: string): string {
  const lowerQ = question.toLowerCase()
  
  if (lowerQ.includes('워킹홀리데이') || lowerQ.includes('working holiday') || lowerQ.includes('whv')) {
    return `## 워킹홀리데이 비자 안내 🛫

**신청 자격:**
- 만 18세 ~ 30세 (국가에 따라 다름)
- 범죄 경력 없음
- 건강 검진 통과
- 충분한 자금 증명 (약 5,000 USD 이상)

**신청 절차:**
1. 온라인 신청서 작성
2. 필요 서류 제출 (여권, 사진, 재정증명 등)
3. 비자 수수료 납부
4. 건강검진 & 신원조회
5. 비자 발급 (보통 2-4주 소요)

**주의사항:**
- 국가마다 신청 기간이 다름
- 조기 마감될 수 있음
- 1회 발급 원칙 (대부분 국가)

더 구체적인 질문이 있으시면 말씀해주세요! 😊`
  }
  
  if (lowerQ.includes('연장') || lowerQ.includes('extend')) {
    return `## 비자 연장 안내 📋

**일반적인 연장 절차:**
1. 만료 최소 1-3개월 전 신청
2. 이민국 웹사이트에서 온라인 신청
3. 필요 서류 업로드
4. 수수료 납부
5. 심사 대기

**필요 서류:**
- 현재 비자 사본
- 여권 (유효기간 6개월 이상)
- 재정 증명서
- 체류 사유 증명 (재학증명서, 재직증명서 등)
- 건강보험 가입 증명

**주의:**
⚠️ 비자 만료 후 신청 시 불법체류가 될 수 있습니다!
⚠️ 연장 심사 중에는 출국하지 마세요.

더 궁금한 점이 있으시면 질문해주세요!`
  }
  
  if (lowerQ.includes('취업') || lowerQ.includes('work') || lowerQ.includes('job')) {
    return `## 취업 비자 안내 💼

**취업비자 종류:**
- E-7 (특정활동): 전문직
- E-9 (비전문취업): 제조업, 농업 등
- H-1B (미국): 전문직 취업
- 기술비자 (호주 TSS)

**기본 요건:**
- 고용주의 스폰서십
- 해당 직종 관련 학력/경력
- 범죄기록 조회 통과
- 건강검진 통과

**절차:**
1. 구인구직 → 고용 확정
2. 고용주가 비자 스폰서 신청
3. 비자 신청서 제출
4. 서류 심사 & 면접 (필요시)
5. 비자 발급

도움이 더 필요하시면 말씀해주세요! 🙌`
  }
  
  if (lowerQ.includes('만료') || lowerQ.includes('expire')) {
    return `## 비자 만료 시 대응 방법 ⚠️

**만료 전:**
✅ 연장 가능 여부 확인
✅ 비자 종류 변경 검토
✅ 출국 일정 계획

**만료 후 (불법체류 상태):**
❌ 즉시 이민국에 연락
❌ 자진 출국 또는 합법화 방안 상담
❌ 벌금/입국금지 가능성 있음

**긴급 상황 대처:**
1. 이민 변호사 상담
2. 본국 대사관 연락
3. 이민국 방문 (자발적 신고)

**예방책:**
📌 비자 만료일 3개월 전 알림 설정
📌 연장 신청은 미리미리!
📌 KNOWGL 비자 알리미 활용

안전한 체류를 위해 항상 비자 상태를 확인하세요!`
  }
  
  // 기본 응답
  return `## 비자 상담 안내 🌏

안녕하세요! KNOWGL AI 비자 상담입니다.

**도움 드릴 수 있는 내용:**
- 🛫 워킹홀리데이 비자 신청
- 📚 학생 비자 연장/변경
- 💼 취업 비자 요건
- 📋 서류 준비 가이드
- ⏰ 비자 만료 대응

**자주 묻는 질문:**
1. "워킹홀리데이 비자 신청 방법"
2. "학생 비자 연장하려면?"
3. "취업 비자 자격 요건은?"

위 질문을 클릭하거나, 궁금한 점을 자유롭게 물어보세요!

⚠️ **주의:** 이 상담은 일반적인 정보 제공 목적이며, 실제 비자 결정은 해당 국가 이민국의 판단에 따릅니다.`
}

export default function AIChatPage() {
  const router = useRouter()
  const { language } = useStore()
  const { showToast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const isKorean = language === 'ko'
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState('whv')

  // 초기 환영 메시지
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: generateAIResponse('', selectedVisa),
        timestamp: new Date()
      }])
    }
  }, [])

  // 스크롤 하단으로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // AI 응답 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(userMessage.content, selectedVisa),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    showToast(isKorean ? '복사되었습니다' : 'Copied!', 'success')
  }

  const resetChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: generateAIResponse('', selectedVisa),
      timestamp: new Date()
    }])
  }

  return (
    <WebLayout showNav={false}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold">{isKorean ? 'AI 비자 상담' : 'AI Visa Consultant'}</h1>
                  <p className="text-xs text-white/70">{isKorean ? '24시간 무료 상담' : '24/7 Free Consultation'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={resetChat}
              className="p-2 hover:bg-white/10 rounded-lg transition"
              title={isKorean ? '대화 초기화' : 'Reset Chat'}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visa Type Selector */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-sm text-gray-500 flex-shrink-0">{isKorean ? '비자 종류:' : 'Visa Type:'}</span>
              {visaTypes.map(visa => (
                <button
                  key={visa.id}
                  onClick={() => setSelectedVisa(visa.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition',
                    selectedVisa === visa.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {isKorean ? visa.name : visa.nameEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-100 rounded-bl-md'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <div 
                        className="text-gray-700 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: message.content
                            .replace(/## (.*)/g, '<h3 class="text-lg font-bold text-gray-900 mt-2 mb-2">$1</h3>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/- (.*)/g, '<li class="ml-4">$1</li>')
                            .replace(/✅/g, '<span class="text-green-600">✅</span>')
                            .replace(/❌/g, '<span class="text-red-600">❌</span>')
                            .replace(/⚠️/g, '<span class="text-amber-600">⚠️</span>')
                            .replace(/📌/g, '<span>📌</span>')
                        }}
                      />
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="mt-2 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> {isKorean ? '복사' : 'Copy'}
                      </button>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{isKorean ? '답변 작성 중...' : 'Thinking...'}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 mb-2">{isKorean ? '자주 묻는 질문:' : 'Quick Questions:'}</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(isKorean ? q.ko : q.en)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-indigo-300 transition"
                  >
                    {isKorean ? q.ko : q.en}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-white border-t px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isKorean ? '비자 관련 질문을 입력하세요...' : 'Ask about visa...'}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed btn-press"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            {isKorean 
              ? '⚠️ AI 상담은 참고용이며, 정확한 정보는 해당 국가 이민국을 통해 확인하세요.'
              : '⚠️ AI consultation is for reference only. Please verify with official immigration offices.'}
          </p>
        </div>
      </div>
    </WebLayout>
  )
}
