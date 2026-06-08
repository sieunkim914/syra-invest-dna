import { useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, ArrowRight, Target, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Screen2Input() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const companies = ['NVIDIA', 'Tesla', 'Apple', 'NAVER', 'Kakao'];

  const handleAnalyze = () => {
    if (input.trim()) {
      navigate('/result');
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
        disabled={!input.trim()}
        className="w-full bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors disabled:bg-black/30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        AI 투자 적합도 분석하기
        <ArrowRight size={18} />
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
