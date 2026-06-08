import { useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, ArrowRight, Loader2, Target, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';

type AnalysisResult = {
  company: string;
  decision: 'BUY' | 'HOLD' | 'AVOID';
  fitScore: number;
  summary: string;
  fitReasons: string[];
  opportunities: string[];
  risks: string[];
  personalizedWarning: string;
  actionGuide: string;
};

export function Screen2Input() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const companies = ['NVIDIA', 'Tesla', 'Apple', 'NAVER', 'Kakao'];

  const handleAnalyze = async () => {
    const company = input.trim();

    if (!company || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company }),
      });

      if (!response.ok) {
        throw new Error('analysis api failed');
      }

      const analysis = (await response.json()) as AnalysisResult;
      navigate('/result', { state: { analysis } });
    } catch (error) {
      console.warn(error);
      navigate('/result', {
        state: {
          analysis: {
            company,
            decision: 'HOLD',
            fitScore: 78,
            summary:
              '현재 API 연결이 불안정해 기본 분석으로 표시합니다. 그래도 입력한 기업 기준으로 투자 성향에 맞춘 점검 흐름은 확인할 수 있습니다.',
            fitReasons: [
              '성장 스토리를 빠르게 이해하고 추적하는 성향과 맞습니다.',
              '변동성을 감내하면서 투자 가설을 세울 수 있습니다.',
              '새로운 산업 변화에 대한 관심과 연결됩니다.',
            ],
            opportunities: ['장기 성장 가능성', '시장 관심 확대', '사업 모델 확장 가능성'],
            risks: ['기대감 선반영', '단기 변동성', '확신이 빠르게 커질 위험'],
            personalizedWarning:
              'API 응답이 실패했으므로 실제 투자 판단에는 추가 확인이 필요합니다. 특히 목표 비중과 손실 기준을 먼저 정하세요.',
            actionGuide: '처음에는 작은 비중으로 관심 종목에 넣고, 실적과 가격 기준을 나누어 확인하세요.',
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-5 py-6 pb-20">
      <div className="mb-10">
        <div className="text-sm mb-8" style={{ fontWeight: 600 }}>
          SYRA Invest DNA
        </div>

        <h1
          className="mb-4"
          style={{
            fontSize: '44px',
            lineHeight: '1.15',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="text-black">어떤 기업이</span>
          <br />
          <span className="text-[#B8A8E8]">당신</span>
          <span className="text-black">과 맞을까?</span>
        </h1>
      </div>

      <div className="bg-[#F5F5F7] p-5 rounded-3xl mb-6">
        <label className="block text-sm mb-3" style={{ fontWeight: 600 }}>
          기업명 또는 티커
        </label>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="예: NVIDIA, Tesla, NAVER"
          className="w-full bg-white px-4 py-3 rounded-2xl border-0 outline-none focus:ring-2 focus:ring-black/10"
        />

        <div className="flex flex-wrap gap-2 mt-4">
          {companies.map((company) => (
            <button
              key={company}
              onClick={() => setInput(company)}
              className="bg-white text-black px-4 py-2 rounded-full text-sm border border-black/10 hover:border-black/30 transition-colors"
            >
              {company}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4" style={{ fontSize: '24px', fontWeight: 700 }}>
          나의 투자 성향
        </h2>

        <div className="space-y-3">
          <TraitCard
            icon={<TrendingUp size={18} className="text-white" />}
            iconClassName="bg-[#B8A8E8]"
            cardClassName="bg-[#E8E1F5]"
            title="성장주 선호"
            text="새로운 산업과 혁신 기업에 빠르게 반응합니다."
          />
          <TraitCard
            icon={<Zap size={18} className="text-white" />}
            iconClassName="bg-black"
            cardClassName="bg-[#F5F5F7]"
            title="고변동성 감내"
            text="가격 흔들림 자체를 크게 두려워하지 않습니다."
          />
          <TraitCard
            icon={<Target size={18} className="text-white" />}
            iconClassName="bg-black"
            cardClassName="bg-[#F5F5F7]"
            title="장기 집중력"
            text="확신한 아이디어를 오래 밀고 갈 수 있습니다."
          />
          <TraitCard
            icon={<AlertTriangle size={18} className="text-white" />}
            iconClassName="bg-[#FF6B4A]"
            cardClassName="bg-[#FFF4F0] border border-[#FF6B4A]/20"
            title="과신 주의"
            text="좋은 아이디어를 발견하면 너무 빠르게 진입할 수 있습니다."
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!input.trim() || isLoading}
        className="w-full bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors disabled:bg-black/30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {isLoading ? 'AI가 분석하는 중...' : 'AI 투자 적합도 분석하기'}
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
      </button>
    </div>
  );
}

function TraitCard({
  icon,
  iconClassName,
  cardClassName,
  title,
  text,
}: {
  icon: ReactNode;
  iconClassName: string;
  cardClassName: string;
  title: string;
  text: string;
}) {
  return (
    <div className={`${cardClassName} p-5 rounded-3xl`}>
      <div className="flex items-start gap-3">
        <div className={`${iconClassName} p-2 rounded-full`}>{icon}</div>
        <div>
          <div className="text-base mb-1" style={{ fontWeight: 600 }}>
            {title}
          </div>
          <div className="text-sm text-black/70">{text}</div>
        </div>
      </div>
    </div>
  );
}
