import { BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const BIBTEX = `@article{song2024kpg193,
  title={KPG 193: A Synthetic Korean Power Grid Test System for Decarbonization Studies},
  author={Song, Geonho and Kim, Jip},
  journal={arXiv preprint arXiv:2411.14756},
  year={2024}
}`;

export const MethodologyPage = () => {
  const { t } = useI18n();
  const pipeline = [
    { num: '01', title: t.methodology.pipeline.dataCol.t, body: t.methodology.pipeline.dataCol.b },
    { num: '02', title: t.methodology.pipeline.cluster.t, body: t.methodology.pipeline.cluster.b },
    { num: '03', title: t.methodology.pipeline.estimate.t, body: t.methodology.pipeline.estimate.b },
    { num: '04', title: t.methodology.pipeline.validate.t, body: t.methodology.pipeline.validate.b },
  ];

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          {t.methodology.label}
        </span>
        <h1 className="font-serif text-4xl italic leading-none tracking-tight text-fg sm:text-5xl">
          {t.methodology.title}
        </h1>
        <p className="max-w-2xl border-l-2 border-fg pl-4 font-serif text-base italic text-fg-muted">
          {t.methodology.tagline}
        </p>
      </header>

      <section className="border border-border bg-bg-elev p-6">
        <div className="flex items-start gap-4">
          <BookOpen size={18} className="mt-1 text-fg-subtle" />
          <div className="flex-1 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              {t.methodology.reference}
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
        <h2 className="font-serif text-2xl italic text-fg">{t.methodology.pipelineTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((step, i) => (
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
              {i < pipeline.length - 1 && (
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
        <h2 className="font-serif text-2xl italic text-fg">{t.methodology.specsTitle}</h2>
        <div className="grid gap-px border border-border bg-border lg:grid-cols-3">
          {t.methodology.specs.map((spec) => (
            <div key={spec.label} className="bg-bg-elev p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
                {spec.label}
              </div>
              <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
                {spec.value}
              </div>
              <div className="mt-1 font-mono text-[10px] text-fg-muted">{spec.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl italic text-fg">{t.methodology.sourcesTitle}</h2>
        <div className="space-y-2">
          {t.methodology.sources.map((s) => (
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
        <h2 className="font-serif text-2xl italic text-fg">{t.methodology.citation}</h2>
        <pre className="overflow-x-auto border border-border bg-bg-elev p-5 font-mono text-[11px] leading-relaxed text-fg">
{BIBTEX}
        </pre>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
          {t.methodology.citationCaption}
        </p>
      </section>
    </div>
  );
};
