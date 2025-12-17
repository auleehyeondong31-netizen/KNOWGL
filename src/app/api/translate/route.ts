import { NextRequest, NextResponse } from 'next/server'

// 무료 번역 (Google Translate 비공식 API)
async function translateFreeServer(text: string, targetLang: string): Promise<string | null> {
  const langMap: Record<string, string> = {
    ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-CN', vi: 'vi',
  }
  const target = langMap[targetLang] || 'en'
  
  try {
    // Google Translate 비공식 API (무료, 안정적)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text.slice(0, 1000))}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    })
    
    if (response.ok) {
      const data = await response.json()
      // 응답 형식: [[["번역된 텍스트","원본 텍스트",null,null,10]],null,"en"]
      if (data && data[0]) {
        const translated = data[0]
          .filter((item: unknown[]) => item[0])
          .map((item: unknown[]) => item[0])
          .join('')
        if (translated) {
          return translated
        }
      }
    }
  } catch (error) {
    console.error('Google Translate error:', error)
  }
  
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, useFree } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'text와 targetLang이 필요합니다.' },
        { status: 400 }
      )
    }

    // 무료 번역 요청인 경우
    if (useFree) {
      const translated = await translateFreeServer(text, targetLang)
      if (translated) {
        return NextResponse.json({ translatedText: translated })
      }
      return NextResponse.json(
        { error: '번역에 실패했습니다.' },
        { status: 500 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const langNames: Record<string, string> = {
      ko: 'Korean',
      en: 'English',
      ja: 'Japanese',
      zh: 'Chinese',
      vi: 'Vietnamese',
    }

    const targetLanguage = langNames[targetLang] || 'English'

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${targetLanguage}. 
Only output the translated text, nothing else. 
Maintain the original tone and style.
If the text is already in ${targetLanguage}, return it as is.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API Error:', error)
      return NextResponse.json(
        { error: '번역 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const translatedText = data.choices[0]?.message?.content?.trim()

    if (!translatedText) {
      return NextResponse.json(
        { error: '번역 결과를 받지 못했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: '번역 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
