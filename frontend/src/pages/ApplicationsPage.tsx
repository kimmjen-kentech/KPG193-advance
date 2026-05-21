import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { DecarbIndexSection } from '../components/applications/DecarbIndexSection';
import { RenewablePotentialSection } from '../components/applications/RenewablePotentialSection';
import { NetLoadSection } from '../components/applications/NetLoadSection';
import { CoalPhaseoutSection } from '../components/applications/CoalPhaseoutSection';
import { RenewableExpansionSection } from '../components/applications/RenewableExpansionSection';
import { CapacityFactorSection } from '../components/applications/CapacityFactorSection';

export const ApplicationsPage = () => {
  const { t } = useI18n();
  const a = t.applications;
  // Card 02 (RE Potential) + Card 03 (Net Load)이 day slider 공유
  const [day, setDay] = useState(180); // 한여름 기본값 — RE 잠재량 잘 보임

  return (
    <div className="space-y-20">
      {/* Hero */}
      <header className="space-y-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          {a.label}
        </span>
        <h1 className="font-serif text-4xl italic leading-none tracking-tight text-fg sm:text-5xl">
          {a.title}
        </h1>
        <p className="max-w-2xl border-l-2 border-fg pl-4 font-serif text-base italic text-fg-muted">
          {a.tagline}
        </p>
      </header>

      <DecarbIndexSection number="01" />
      <RenewablePotentialSection number="02" day={day} onDayChange={setDay} />
      <NetLoadSection number="03" day={day} />
      <CoalPhaseoutSection number="04" />
      <RenewableExpansionSection number="05" />
      <CapacityFactorSection number="06" />
    </div>
  );
};
