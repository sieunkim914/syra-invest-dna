import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  FileText,
  Paperclip,
  Send,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';

type ChatMessage = {
  role: 'ai' | 'user';
  content: string;
};

type FileContext = {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileText: string;
  parseStatus: 'parsed' | 'metadata_only' | 'none';
};

const readableExtensions = ['txt', 'csv', 'json', 'md'];
const emptyFileContext: FileContext = {
  fileName: '',
  fileType: '',
  fileSize: 0,
  fileText: '',
  parseStatus: 'none',
};

const fallbackReply =
  '좋은 질문입니다. 당신의 성향상 투자 아이디어에 대한 확신이 빠르게 생길 수 있습니다. 지금은 매수 여부보다 먼저 투자 가설, 목표 비중, 손실 허용선, 추가 매수 조건을 분리해서 정리하는 것이 좋습니다. 첨부파일이 있다면 핵심 수치나 문장을 함께 보내주면 투자 관점에서 요약해드릴 수 있습니다.';

export function ChatTab() {
  const [input, setInput] = useState('');
  const [fileContext, setFileContext] = useState<FileContext>(emptyFileContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content:
        '안녕하세요. 투자 관련 고민을 자유롭게 물어보세요. 기업명, 재무제표, 기사, 리포트, 캡처 이미지를 올리면 성향 기반으로 함께 분석해드릴게요.',
    },
  ]);

  const suggestedQuestions = [
    '이 종목 분석해줘',
    '재무제표 쉽게 설명해줘',
    '지금 사도 될까?',
    '내 성향상 위험한 판단이야?',
    '분할매수 계획 짜줘',
    '첨부파일 요약해줘',
  ];

  const handleSend = async (question = input) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmedQuestion }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map((message) => ({
            role: message.role === 'ai' ? 'assistant' : 'user',
            content: message.content,
          })),
          question: trimmedQuestion,
          fileContext,
        }),
      });

      if (!response.ok) {
        throw new Error('chat api failed');
      }

      const data = await response.json();
      setMessages([...nextMessages, { role: 'ai', content: data.reply || fallbackReply }]);
    } catch (error) {
      console.warn(error);
      setMessages([...nextMessages, { role: 'ai', content: fallbackReply }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const baseContext = {
      fileName: file.name,
      fileType: file.type || extension || 'unknown',
      fileSize: file.size,
    };

    if (!readableExtensions.includes(extension)) {
      setFileContext({
        ...baseContext,
        fileText: '',
        parseStatus: 'metadata_only',
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFileContext({
        ...baseContext,
        fileText: String(reader.result || '').slice(0, 12000),
        parseStatus: 'parsed',
      });
    };

    reader.onerror = () => {
      setFileContext({
        ...baseContext,
        fileText: '',
        parseStatus: 'metadata_only',
      });
    };

    reader.readAsText(file);
  };

  const removeFile = () => {
    setFileContext(emptyFileContext);
  };

  return (
    <div className="min-h-screen bg-white px-5 py-6 flex flex-col pb-20">
      <div className="mb-6">
        <div className="text-xs mb-3 text-black/60" style={{ fontWeight: 600 }}>
          AI 투자 채팅
        </div>

        <h1
          className="mb-2"
          style={{
            fontSize: '40px',
            lineHeight: '1.1',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="text-black">투자 고민을</span>
          <br />
          <span className="text-[#B8A8E8]">AI</span>
          <span className="text-black">와 정리하기</span>
        </h1>

        <p className="text-sm text-black/60 leading-relaxed">
          종목 질문, 재무제표 해석, 투자 아이디어 점검, 첨부파일 분석까지 한 곳에서 상담합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <FeatureCard
          icon={<TrendingUp size={20} className="text-[#B8A8E8]" strokeWidth={2.5} />}
          className="bg-[#E8E1F5]"
          title="종목 상담"
          text='"이 기업 지금 봐도 될까?"'
        />
        <FeatureCard
          icon={<AlertTriangle size={20} strokeWidth={2.5} />}
          className="bg-[#FF6B4A] text-white"
          title="리스크 점검"
          text='"내가 너무 빨리 확신한 걸까?"'
          textClassName="text-white/80"
        />
        <FeatureCard
          icon={<FileText size={20} className="text-black" strokeWidth={2.5} />}
          className="bg-[#F5F5F7]"
          title="파일 분석"
          text="PDF, CSV, 리포트, 캡처 업로드"
        />
        <FeatureCard
          icon={<TrendingUp size={20} strokeWidth={2.5} />}
          className="bg-black text-white"
          title="투자 원칙"
          text="감정이 아니라 기준으로 판단하기"
          textClassName="text-white/70"
        />
      </div>

      <div className="flex-1 mb-4 space-y-3 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-4 rounded-3xl ${
                message.role === 'ai' ? 'bg-[#F5F5F7]' : 'bg-[#FF6B4A] text-white'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-4 rounded-3xl bg-[#E8E1F5]">
              <p className="text-sm leading-relaxed">투자 기준을 정리하는 중...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              onClick={() => handleSend(question)}
              disabled={isLoading}
              className="bg-white border border-black/10 text-black px-3 py-2 rounded-full text-xs hover:border-black/30 transition-colors disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#F5F5F7] p-4 rounded-3xl mb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-black/60" />
            <div className="text-sm" style={{ fontWeight: 600 }}>
              파일 첨부
            </div>
          </div>
          <label className="bg-black text-white px-4 py-1.5 rounded-full text-xs hover:bg-black/90 transition-colors cursor-pointer">
            파일 선택
            <input
              type="file"
              accept=".txt,.csv,.json,.md,.pdf,.docx,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="text-xs text-black/60 leading-relaxed mb-3">
          PDF, CSV, 이미지, 리포트 업로드
          <br />
          텍스트 파일은 읽고, PDF/이미지는 데모 모드에서 메타데이터만 보냅니다.
        </div>

        {fileContext.parseStatus !== 'none' && (
          <div className="bg-white border border-black/10 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <FileText size={16} className="text-black/60 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs truncate" style={{ fontWeight: 600 }}>
                  {fileContext.fileName}
                </div>
                <div className="text-xs text-black/40">
                  {fileContext.parseStatus === 'parsed' ? '텍스트 읽음' : '메타데이터만 첨부'}
                </div>
              </div>
            </div>
            <button onClick={removeFile} className="text-black/40 hover:text-black transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#F5F5F7] p-3 rounded-3xl mb-3">
        <div className="flex items-center gap-2">
          <label className="text-black/40 hover:text-black transition-colors p-2 cursor-pointer">
            <Paperclip size={18} />
            <input
              type="file"
              accept=".txt,.csv,.json,.md,.pdf,.docx,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSend()}
            placeholder="투자 질문을 입력하세요"
            className="flex-1 bg-transparent px-2 py-2 outline-none text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-black text-white p-3 rounded-full hover:bg-black/90 transition-colors disabled:bg-black/30 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <div className="text-xs text-black/40 leading-relaxed text-center mb-2">
        본 대화는 투자 참고용이며, 최종 투자 판단은 사용자 본인의 책임입니다.
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  className,
  title,
  text,
  textClassName = 'text-black/60',
}: {
  icon: ReactNode;
  className: string;
  title: string;
  text: string;
  textClassName?: string;
}) {
  return (
    <div className={`${className} p-4 rounded-3xl`}>
      <div className="mb-2">{icon}</div>
      <div className="text-sm mb-1" style={{ fontWeight: 700 }}>
        {title}
      </div>
      <div className={`text-xs ${textClassName}`}>{text}</div>
    </div>
  );
}
