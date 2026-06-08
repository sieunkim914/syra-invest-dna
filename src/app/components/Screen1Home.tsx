import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Screen1Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-5 py-6 pb-20">
      <nav className="flex justify-between items-center mb-12">
        <div className="flex gap-6 text-sm">
          <button className="text-black/60 hover:text-black transition-colors">About</button>
          <button className="text-black/60 hover:text-black transition-colors">Profile</button>
          <button className="text-black hover:text-black transition-colors">Analyze</button>
        </div>
      </nav>

      <div className="mb-8">
        <div className="mb-4 inline-block">
          <span className="bg-[#FF6B4A] text-white px-4 py-1.5 rounded-full text-xs">
            AI Investment Fit
          </span>
        </div>

        <h1
          className="mb-6"
          style={{
            fontSize: '56px',
            lineHeight: '1.1',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <div className="text-black">투자를</div>
          <div className="text-[#B8A8E8]">나답게</div>
          <div className="text-black">분석하다</div>
        </h1>

        <p className="text-black/60 mb-6 text-base leading-relaxed">
          AI가 기업의 매력도와 나의 투자 성향 적합도를
          <br />
          함께 분석합니다.
        </p>

        <button
          onClick={() => navigate('/input')}
          className="bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors inline-flex items-center gap-2"
        >
          분석 시작하기
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-black text-white p-5 rounded-3xl col-span-2">
          <div className="text-sm mb-2 opacity-70">투자 DNA</div>
          <div className="text-xl" style={{ fontWeight: 600 }}>
            High Conviction
            <br />
            Explorer
          </div>
        </div>

        <div className="bg-[#E8E1F5] text-black p-5 rounded-3xl">
          <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: '1.1' }}>84%</div>
          <div className="text-sm mt-2">성장주 적합도</div>
        </div>

        <div className="bg-[#FF6B4A] text-white p-5 rounded-3xl">
          <div className="text-sm mb-2">주의</div>
          <div className="text-base" style={{ fontWeight: 600 }}>
            충동 진입
            <br />
            리스크
          </div>
        </div>

        <div className="bg-[#F5F5F7] text-black p-5 rounded-3xl">
          <div className="text-base" style={{ fontWeight: 600 }}>
            전략형 투자자
          </div>
          <div className="text-sm mt-2 text-black/60">독립 판단 선호</div>
        </div>

        <div className="bg-[#F5F5F7] text-black p-5 rounded-3xl flex items-center justify-center">
          <TrendingUp size={32} strokeWidth={2.5} />
        </div>
      </div>

      <div className="text-xs text-black/40 leading-relaxed">
        본 서비스는 투자 참고용 분석이며 수익을 보장하지 않습니다.
      </div>
    </div>
  );
}
