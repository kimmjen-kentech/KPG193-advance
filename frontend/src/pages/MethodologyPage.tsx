import { BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

const BIBTEX = `@article{song2024kpg193,
  title={KPG 193: A Synthetic Korean Power Grid Test System for Decarbonization Studies},
  author={Song, Geonho and Kim, Jip},
  journal={arXiv preprint arXiv:2411.14756},
  year={2024}
}`;

const PIPELINE = [
  { num: '01', title: 'Data Collection', body: 'OpenStreetMap, KEPCO, KPX, 시·도 통계' },
  { num: '02', title: 'Spatial Clustering', body: 'KEPCO 사업소 단위 노드 집계 (보안 추상화)' },
  { num: '03', title: 'Parameter Estimation', body: '발전기·송전선 매개변수, 재생에너지 프로파일' },
  { num: '04', title: 'Validation', body: '8,760 h 전체에 대한 UC + AC-OPF 수렴 검증' },
];

const SOURCES = [
  { name: 'OpenStreetMap', purpose: '송전망 토폴로지 (ODbL)' },
  { name: 'KEPCO', purpose: '발전기·송전선 매개변수 (공개 통계)' },
  { name: 'KPX', purpose: '시간별 수요 패턴' },
  { name: 'LDAPS', purpose: '기상 데이터 (태양광·풍력 프로파일)' },
];

export const MethodologyPage = () => (
  <div className="space-y-12">
    <header className="space-y-3">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
        Methodology
      </span>
      <h1 className="font-serif text-5xl italic leading-none tracking-tight text-fg">
        Methodology.
      </h1>
      <p className="max-w-2xl border-l-2 border-fg pl-4 font-serif text-base italic text-fg-muted">
        공개 데이터만으로 구축한 한국 전력망 합성 테스트 시스템. 보안에 민감한
        세부 정보는 공간 클러스터링으로 추상화하되, 수학적 충실도(UC / AC-OPF)는
        유지.
      </p>
    </header>

    <section className="border border-border bg-bg-elev p-6">
      <div className="flex items-start gap-4">
        <BookOpen size={18} className="mt-1 text-fg-subtle" />
        <div className="flex-1 space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            Reference
          </div>
          <p className="font-serif text-lg italic leading-snug text-fg">
            KPG 193: A Synthetic Korean Power Grid Test System for Decarbonization
            Studies
          </p>
          <p className="font-mono text-[11px] text-fg-muted">
            Song, Geonho &amp; Kim, Jip · arXiv:2411.14756 · 2024
          </p>
          <a
            href="https://arxiv.org/abs/2411.14756"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 pt-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg underline decoration-fg/40 underline-offset-4 hover:decoration-fg"
          >
            arXiv:2411.14756
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="font-serif text-2xl italic text-fg">Construction Pipeline</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PIPELINE.map((step, i) => (
          <div key={step.num} className="relative border border-border bg-bg-elev p-5">
            <div className="font-mono text-3xl font-bold tabular-nums text-fg/20">
              {step.num}
            </div>
            <h3 className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-fg">
              {step.title}
            </h3>
            <p className="mt-2 font-serif text-sm italic text-fg-muted">
              {step.body}
            </p>
            {i < PIPELINE.length - 1 && (
              <ArrowRight
                size={14}
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 text-fg/30 lg:block"
              />
            )}
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="font-serif text-2xl italic text-fg">System Specifications</h2>
      <div className="grid gap-px border border-border bg-border lg:grid-cols-3">
        {[
          ['Buses', '193', 'substations + load centers'],
          ['Generators', '122', 'thermal (coal/lng/nuclear)'],
          ['AC Branches', '358', '765 / 345 / 154 kV'],
          ['DC Lines', '1', '500 kV HVDC'],
          ['Voltage Levels', '4', 'AC: 765·345·154 / DC: 500'],
          ['Regions', '5', 'KEPCO 사업소 클러스터'],
          ['Time Resolution', '1 h', '8,760 h / year'],
          ['Year', '2022', 'reference period'],
          ['License', 'ODbL 1.0', 'free + open'],
        ].map(([label, value, note]) => (
          <div key={label} className="bg-bg-elev p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              {label}
            </div>
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {value}
            </div>
            <div className="mt-1 font-mono text-[10px] text-fg-muted">{note}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="font-serif text-2xl italic text-fg">Data Sources</h2>
      <div className="space-y-2">
        {SOURCES.map((s) => (
          <div
            key={s.name}
            className="grid grid-cols-[160px_1fr] items-baseline border border-border bg-bg-elev px-5 py-3"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-fg">
              {s.name}
            </span>
            <span className="font-serif text-sm italic text-fg-muted">{s.purpose}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="font-serif text-2xl italic text-fg">Citation</h2>
      <pre className="overflow-x-auto border border-border bg-bg-elev p-5 font-mono text-[11px] leading-relaxed text-fg">
{BIBTEX}
      </pre>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
        연구에 본 시스템을 사용하실 경우 위 BibTeX로 인용 부탁드립니다.
      </p>
    </section>
  </div>
);
