const getFallbackScore = (company) => {
  const normalized = String(company || '').toUpperCase();
  const hash = [...normalized].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return 68 + (hash % 24);
};

const fallbackAnalysis = (company) => {
  const fitScore = getFallbackScore(company);
  const decision = fitScore >= 86 ? 'BUY' : fitScore >= 74 ? 'HOLD' : 'AVOID';

  return {
  company,
  decision,
  fitScore,
  summary:
    `${company}은(는) 혁신성과 성장 스토리 측면에서 High Conviction Explorer 성향과 맞닿아 있습니다. 다만 기대감이 이미 가격에 반영되었을 수 있어 즉시 큰 비중으로 진입하기보다 근거와 가격 기준을 나누어 확인하는 접근이 더 적합합니다.`,
  fitReasons: [
    '새로운 산업과 기술 변화에 빠르게 반응하는 성향과 잘 맞습니다.',
    '높은 변동성을 견디며 장기 아이디어를 추적하는 투자 방식과 부합합니다.',
    '독립적으로 판단하고 강한 확신을 실행으로 옮기는 성향에 맞는 분석 대상입니다.',
  ],
  opportunities: [
    '장기 성장 산업 또는 구조적 변화의 수혜 가능성',
    '제품, 브랜드, 생태계, 데이터 등 경쟁 우위가 확장될 가능성',
    '실적 성장과 시장 기대가 함께 강화될 때 높은 upside 가능성',
  ],
  risks: [
    '높은 기대가 밸류에이션에 이미 반영되었을 가능성',
    '단기 뉴스와 실적 발표 전후의 큰 가격 변동성',
    '낮은 위험회피 성향으로 인해 너무 빠르게 큰 비중을 실을 위험',
    '확신이 강해질수록 반대 증거를 과소평가할 가능성',
  ],
  personalizedWarning:
    '당신의 가장 큰 위험은 공포가 아니라 빠른 확신입니다. 매수 전 최대 비중, 손실 인정 기준, 추가 매수 조건을 숫자로 정하지 않았다면 아직 좋은 판단이 아니라 강한 끌림일 수 있습니다.',
  actionGuide:
    '관심 비중을 작게 시작하고 2~3회 분할 진입을 기본으로 두세요. 첫 매수 전 목표 비중, 실적 확인 지표, 손절 또는 재검토 기준을 먼저 적어두는 것을 권장합니다.',
  };
};

const normalizeAnalysis = (payload, company) => {
  const decision = ['BUY', 'HOLD', 'AVOID'].includes(payload?.decision)
    ? payload.decision
    : 'HOLD';
  const fitScore = Math.max(0, Math.min(100, Number(payload?.fitScore) || 80));

  return {
    company: String(payload?.company || company),
    decision,
    fitScore,
    summary: String(payload?.summary || fallbackAnalysis(company).summary),
    fitReasons: Array.isArray(payload?.fitReasons)
      ? payload.fitReasons.slice(0, 5).map(String)
      : fallbackAnalysis(company).fitReasons,
    opportunities: Array.isArray(payload?.opportunities)
      ? payload.opportunities.slice(0, 5).map(String)
      : fallbackAnalysis(company).opportunities,
    risks: Array.isArray(payload?.risks)
      ? payload.risks.slice(0, 5).map(String)
      : fallbackAnalysis(company).risks,
    personalizedWarning: String(
      payload?.personalizedWarning || fallbackAnalysis(company).personalizedWarning,
    ),
    actionGuide: String(payload?.actionGuide || fallbackAnalysis(company).actionGuide),
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const company = String(req.body?.company || '').trim();

  if (!company) {
    return res.status(400).json({ error: 'company is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json(fallbackAnalysis(company));
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are SYRA Invest DNA, a Korean personalized investment fit analyst. Return only valid JSON. Never guarantee profit. Never tell the user they must buy.',
          },
          {
            role: 'user',
            content: `
Analyze this company for the investment persona below.

Company: ${company}

User profile:
- Investment persona: High Conviction Explorer
- TCI: Novelty Seeking 99, Harm Avoidance 1, Reward Dependence 2, Persistence 99, Self-Directedness 99, Cooperativeness 75, Self-Transcendence 97
- Gallup: Individualization, Strategic, Achiever, Ideation, Command
- MBTI: ENTP

Return Korean JSON exactly with:
{
  "company": string,
  "decision": "BUY" | "HOLD" | "AVOID",
  "fitScore": number,
  "summary": string,
  "fitReasons": string[],
  "opportunities": string[],
  "risks": string[],
  "personalizedWarning": string,
  "actionGuide": string
}

Use concise, polished fintech language. Focus on fit, overconfidence risk, staged entry, position sizing, and risk management.
`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return res.status(200).json(normalizeAnalysis(parsed, company));
  } catch (error) {
    console.error(error);
    return res.status(200).json(fallbackAnalysis(company));
  }
}
