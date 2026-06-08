import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

type Message = {
  role: 'ai' | 'user';
  content: string;
};

export function Screen4Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content:
        'NVIDIA는 당신의 성장 지향성과 잘 맞지만, 현재는 기대감이 가격에 많이 반영되었을 수 있습니다. 지금 가장 궁금한 점은 무엇인가요?',
    },
    {
      role: 'user',
      content: '지금 바로 사도 될까?',
    },
    {
      role: 'ai',
      content:
        '당신의 성향상 좋은 아이디어를 발견하면 빠르게 진입하고 싶어질 가능성이 큽니다. 지금은 전액 매수보다 3회 분할 진입과 목표 비중 제한이 더 적합합니다.',
    },
  ]);

  const suggestedQuestions = [
    '왜 HOLD야?',
    '분할매수는 어떻게 해?',
    '내 성향상 뭐가 위험해?',
    '진입 전 체크리스트 보여줘',
    '손절 기준은 어떻게 잡아?',
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: '좋은 질문입니다. 당신의 투자 성향을 고려하여 답변드리겠습니다.',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white px-5 py-6 pb-20 flex flex-col">
      <div className="mb-6">
        <h1
          className="mb-2"
          style={{
            fontSize: '36px',
            lineHeight: '1.1',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          AI 투자 코치
        </h1>
        <p className="text-sm text-black/60">분석 결과를 바탕으로 지금의 판단을 함께 점검합니다.</p>
      </div>

      <div className="bg-[#F5F5F7] p-5 rounded-3xl mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <ContextItem label="기업" value="NVIDIA" />
          <div>
            <div className="text-black/60 mb-1">판단</div>
            <div className="inline-block bg-[#B8A8E8] text-white px-3 py-1 rounded-full text-xs" style={{ fontWeight: 600 }}>
              HOLD
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <ContextItem label="투자 적합도" value="84 / 100" />
          <ContextItem label="투자 DNA" value="High Conviction Explorer" />
        </div>
      </div>

      <div className="bg-[#FFF4F0] border border-[#FF6B4A]/20 p-4 rounded-2xl mb-4">
        <p className="text-xs leading-relaxed text-black/70">
          당신은 성장주와 혁신 기업에 강하게 끌리는 투자자입니다. AI 코치는 확신이
          너무 빨라지지 않도록 질문을 통해 의사결정을 정리합니다.
        </p>
      </div>

      <div className="bg-black text-white p-5 rounded-3xl mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={18} />
          <div className="text-base" style={{ fontWeight: 700 }}>
            충동 진입 방지 체크
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {['목표 비중을 정했나요?', '손실 허용선을 정했나요?', '실적 발표 일정을 확인했나요?'].map(
            (item, index) => (
              <div className="flex items-start gap-2" key={item}>
                <span className="text-white/60">{index + 1}.</span>
                <span>{item}</span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="flex-1 mb-4 space-y-3 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-4 rounded-3xl ${
                message.role === 'ai'
                  ? index === 0
                    ? 'bg-[#E8E1F5]'
                    : 'bg-[#F5F5F7]'
                  : 'bg-[#FF6B4A] text-white'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              onClick={() => setInput(question)}
              className="bg-white border border-black/10 text-black px-4 py-2 rounded-full text-xs hover:border-black/30 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#F5F5F7] p-3 rounded-3xl mb-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSend()}
            placeholder="투자 코치에게 질문하기"
            className="flex-1 bg-transparent px-2 py-2 outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-black text-white p-3 rounded-full hover:bg-black/90 transition-colors disabled:bg-black/30 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <div className="text-xs text-black/40 leading-relaxed text-center">
        본 대화는 투자 참고용이며, 최종 투자 판단은 사용자 본인의 책임입니다.
      </div>
    </div>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-black/60 mb-1">{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
