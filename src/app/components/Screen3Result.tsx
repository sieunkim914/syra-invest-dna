import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Shield,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

export function Screen3Result() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-5 py-6 pb-20">
      <div className="mb-8">
        <div className="text-sm mb-6" style={{ fontWeight: 600 }}>
          AI 분석 결과
        </div>

        <div className="bg-[#F5F5F7] px-4 py-2 rounded-full inline-block mb-6">
          <span className="text-sm" style={{ fontWeight: 600 }}>
            NVIDIA
          </span>
        </div>

        <h1
          className="mb-4"
          style={{
            fontSize: '40px',
            lineHeight: '1.15',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="text-black">이 기업은</span>
          <br />
          <span className="text-black">당신과 꽤 잘 맞습니다</span>
        </h1>

        <div className="inline-block">
          <span
            className="bg-[#B8A8E8] text-white px-5 py-2 rounded-full text-sm"
            style={{ fontWeight: 600 }}
          >
            HOLD
          </span>
        </div>
      </div>

      <div className="bg-black text-white p-6 rounded-3xl mb-6">
        <div className="mb-3">
          <div style={{ fontSize: '48px', fontWeight: 700, lineHeight: '1' }}>
            84 <span className="text-white/60">/ 100</span>
          </div>
        </div>
        <div className="text-sm mb-3 text-white/70">투자 적합도</div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="bg-[#FF6B4A] h-full rounded-full" style={{ width: '84%' }} />
        </div>
      </div>

      <div className="bg-[#F5F5F7] p-5 rounded-3xl mb-6">
        <p className="text-sm leading-relaxed text-black/80">
          이 기업은 사용자의 성장 지향적이고 혁신 선호적인 성향과 잘 맞습니다. 다만
          시장 기대감이 이미 가격에 반영되었을 가능성이 있어 즉시 전액 진입보다
          분할 접근이 적합합니다.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <ResultCard
          icon={<CheckCircle2 size={18} className="text-white" />}
          iconClassName="bg-[#B8A8E8]"
          cardClassName="bg-[#E8E1F5]"
          title="나와 잘 맞는 이유"
          items={['AI 산업의 장기 성장성', '변동성을 견딜 수 있는 성향', '미래 기술 선호와 부합']}
        />

        <div className="bg-[#FF6B4A] text-white p-5 rounded-3xl">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-full">
              <AlertTriangle size={18} className="text-white" />
            </div>
            <div className="text-base" style={{ fontWeight: 700 }}>
              개인화 경고
            </div>
          </div>
          <p className="text-sm leading-relaxed ml-11">
            위험회피가 매우 낮기 때문에 좋은 기업을 발견하면 지나치게 빠르게
            확신할 수 있습니다.
          </p>
        </div>

        <ResultCard
          icon={<TrendingUp size={18} className="text-white" />}
          iconClassName="bg-black"
          cardClassName="bg-[#F5F5F7]"
          title="기회 요인"
          items={['AI 인프라 수요 확대', '데이터센터 투자 증가', '생태계 확장']}
        />

        <ResultCard
          icon={<Shield size={18} className="text-white" />}
          iconClassName="bg-white/20"
          cardClassName="bg-black text-white"
          title="리스크"
          items={['고평가 부담', '단기 변동성', '실적 기대치 과열']}
          dark
        />

        <div className="bg-[#F5F5F7] border-2 border-black/10 p-5 rounded-3xl">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-[#B8A8E8] p-2 rounded-full">
              <Target size={18} className="text-white" />
            </div>
            <div className="text-base" style={{ fontWeight: 700 }}>
              액션 가이드
            </div>
          </div>
          <p className="text-sm leading-relaxed text-black/80 ml-11">
            즉시 전액 매수보다 3회 분할 진입, 목표 비중 제한, 실적 발표 전후 변동성
            확인을 권장합니다.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/chat-tab')}
          className="w-full bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors inline-flex items-center justify-center gap-2"
        >
          이 결과를 채팅에서 상담하기
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => navigate('/input')}
          className="w-full bg-white text-black border-2 border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition-colors inline-flex items-center justify-center gap-2"
        >
          다른 기업 분석하기
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function ResultCard({
  icon,
  iconClassName,
  cardClassName,
  title,
  items,
  dark = false,
}: {
  icon: ReactNode;
  iconClassName: string;
  cardClassName: string;
  title: string;
  items: string[];
  dark?: boolean;
}) {
  return (
    <div className={`${cardClassName} p-5 rounded-3xl`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`${iconClassName} p-2 rounded-full`}>{icon}</div>
        <div className="text-base" style={{ fontWeight: 700 }}>
          {title}
        </div>
      </div>
      <ul className={`space-y-1.5 text-sm ml-11 ${dark ? 'text-white/80' : 'text-black/80'}`}>
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
