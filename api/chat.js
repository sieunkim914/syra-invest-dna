const fallbackReply =
  '좋은 질문입니다. 당신의 성향상 투자 아이디어에 대한 확신이 빠르게 생길 수 있습니다. 지금은 매수 여부보다 먼저 투자 가설, 목표 비중, 손실 허용선, 추가 매수 조건을 분리해서 정리하는 것이 좋습니다. 첨부파일이 있다면 핵심 수치나 문장을 함께 보내주면 투자 관점에서 요약해드릴 수 있습니다.';

const sanitizeMessages = (messages = []) =>
  messages
    .filter((message) => ['user', 'assistant'].includes(message?.role) && message?.content)
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: String(message.content).slice(0, 1400),
    }));

const sanitizeFileContext = (fileContext = {}) => {
  const parseStatus = ['parsed', 'metadata_only', 'none'].includes(fileContext.parseStatus)
    ? fileContext.parseStatus
    : 'none';

  return {
    fileName: String(fileContext.fileName || ''),
    fileType: String(fileContext.fileType || ''),
    fileSize: Number(fileContext.fileSize) || 0,
    fileText: String(fileContext.fileText || '').slice(0, 12000),
    parseStatus,
  };
};

const buildFilePrompt = (fileContext) => {
  if (fileContext.parseStatus === 'parsed' && fileContext.fileText) {
    return `
Attached file:
- name: ${fileContext.fileName}
- type: ${fileContext.fileType}
- size: ${fileContext.fileSize}
- parseStatus: parsed

File text:
${fileContext.fileText}

If the user asks about the file, summarize it from an investment perspective and connect it to thesis, evidence, valuation, risk, and decision rules.
`;
  }

  if (fileContext.parseStatus === 'metadata_only') {
    return `
Attached file:
- name: ${fileContext.fileName}
- type: ${fileContext.fileType}
- size: ${fileContext.fileSize}
- parseStatus: metadata_only

Detailed file parsing is limited in this demo. If relevant, clearly say the file is attached but content parsing is limited, then ask the user to paste key text or numbers.
`;
  }

  return 'No file is attached.';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const question = String(req.body?.question || '').trim();
  const messages = sanitizeMessages(req.body?.messages);
  const fileContext = sanitizeFileContext(req.body?.fileContext);

  if (!question) {
    return res.status(400).json({ error: 'question is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({ reply: fallbackReply });
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
        messages: [
          {
            role: 'system',
            content: `
You are the independent AI investment chat inside SYRA Invest DNA.
Act as both an AI investment coach and a fintech analyst.

Answer in Korean.
Be concise, practical, and structured.

You can discuss:
- stocks and companies
- investment ideas
- financial statements
- risk and valuation
- decision rules
- portfolio behavior and position sizing
- user-uploaded file context

User investment profile:
- Investment persona: High Conviction Explorer
- TCI: Novelty Seeking 99, Harm Avoidance 1, Reward Dependence 2, Persistence 99, Self-Directedness 99, Cooperativeness 75, Self-Transcendence 97
- Gallup: Individualization, Strategic, Achiever, Ideation, Command
- MBTI: ENTP

Coaching logic:
- This user is bold, strategic, independent, highly persistent, and strongly attracted to innovation.
- The biggest risk is not fear but overconfidence, fast conviction, and entering before defining risk limits.
- Convert excitement into a structured investment plan:
  thesis, evidence, valuation, risk, position size, entry rule, exit rule, review date.

Rules:
- Never guarantee returns.
- Never say "definitely buy".
- Use cautious but useful investment language.
- If fileText exists, summarize it from an investment perspective when relevant.
- If only file metadata exists, say detailed parsing is limited in demo mode and ask the user to paste key text or numbers.
`,
          },
          {
            role: 'user',
            content: buildFilePrompt(fileContext),
          },
          ...messages,
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    return res.status(200).json({ reply: reply || fallbackReply });
  } catch (error) {
    console.error(error);
    return res.status(200).json({ reply: fallbackReply });
  }
}
