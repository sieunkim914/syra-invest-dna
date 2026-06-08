import { AlertTriangle, Settings, Target, TrendingUp, User, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

export function ProfileTab() {
  return (
    <div className="min-h-screen bg-white px-5 py-6 pb-20">
      <div className="mb-8">
        <div className="text-xs mb-3 text-black/60" style={{ fontWeight: 600 }}>
          내 프로필
        </div>

        <h1
          className="mb-4"
          style={{
            fontSize: '40px',
            lineHeight: '1.1',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="text-black">나의</span>
          <br />
          <span className="text-[#B8A8E8]">투자 DNA</span>
        </h1>
      </div>

      <div className="bg-black text-white p-6 rounded-3xl mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-4 rounded-full">
            <User size={32} className="text-white" />
          </div>
          <div>
            <div className="text-sm text-white/60 mb-1">투자 성향</div>
            <div className="text-xl" style={{ fontWeight: 700 }}>
              High Conviction Explorer
            </div>
          </div>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          대담하고 전략적이며 독립적인 투자자. 혁신을 추구하고 높은 지속성을 보임.
          과신과 충동적 진입을 제어할 구조가 필요함.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>
          TCI 성향 점수
        </h2>

        <div className="space-y-2">
          <ScoreBar label="Novelty Seeking" value={99} lavender />
          <ScoreBar label="Harm Avoidance" value={1} />
          <ScoreBar label="Persistence" value={99} />
          <ScoreBar label="Self-Directedness" value={99} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>
          Gallup Strengths
        </h2>

        <div className="flex flex-wrap gap-2">
          {['Individualization', 'Strategic', 'Achiever', 'Ideation', 'Command'].map((strength) => (
            <div
              key={strength}
              className="bg-[#FF6B4A] text-white px-4 py-2 rounded-full text-sm"
              style={{ fontWeight: 600 }}
            >
              {strength}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>
          투자 특성
        </h2>

        <div className="space-y-3">
          <TraitCard
            icon={<TrendingUp size={16} className="text-white" />}
            iconClassName="bg-[#B8A8E8]"
            cardClassName="bg-[#E8E1F5]"
            title="성장주 선호"
            text="새로운 산업과 혁신 기업에 빠르게 반응"
          />
          <TraitCard
            icon={<Zap size={16} className="text-white" />}
            iconClassName="bg-black"
            cardClassName="bg-[#F5F5F7]"
            title="고변동성 감내"
            text="가격 흔들림을 크게 두려워하지 않음"
          />
          <TraitCard
            icon={<Target size={16} className="text-white" />}
            iconClassName="bg-black"
            cardClassName="bg-[#F5F5F7]"
            title="장기 집중력"
            text="확신한 아이디어를 오래 밀고 갈 수 있음"
          />
          <TraitCard
            icon={<AlertTriangle size={16} className="text-white" />}
            iconClassName="bg-[#FF6B4A]"
            cardClassName="bg-[#FFF4F0] border border-[#FF6B4A]/20"
            title="과신 주의"
            text="좋은 아이디어 발견 시 빠른 진입 경향"
          />
        </div>
      </div>

      <button className="w-full bg-[#F5F5F7] text-black px-6 py-4 rounded-full hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
        <Settings size={18} />
        프로필 설정
      </button>
    </div>
  );
}

function ScoreBar({ label, value, lavender = false }: { label: string; value: number; lavender?: boolean }) {
  return (
    <div className={`${lavender ? 'bg-[#E8E1F5]' : 'bg-[#F5F5F7]'} p-4 rounded-2xl`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm" style={{ fontWeight: 600 }}>
          {label}
        </span>
        <span className="text-sm" style={{ fontWeight: 700 }}>
          {value}
        </span>
      </div>
      <div className={`${lavender ? 'bg-white/50' : 'bg-black/10'} w-full rounded-full h-1.5`}>
        <div
          className={`${lavender ? 'bg-[#B8A8E8]' : 'bg-black'} h-full rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
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
    <div className={`${cardClassName} p-4 rounded-3xl`}>
      <div className="flex items-start gap-3">
        <div className={`${iconClassName} p-2 rounded-full`}>{icon}</div>
        <div>
          <div className="text-sm mb-1" style={{ fontWeight: 600 }}>
            {title}
          </div>
          <div className="text-xs text-black/70">{text}</div>
        </div>
      </div>
    </div>
  );
}
