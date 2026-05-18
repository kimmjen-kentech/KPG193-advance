import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';

export const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-border bg-bg-elev sm:mt-24">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 md:grid-cols-2 lg:px-8 lg:py-12">
        <div className="space-y-2">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            {t.footer.citeAs}
          </h4>
          <p className="font-serif text-sm italic leading-snug text-fg">
            Song, G. &amp; Kim, J. (2024). <em>KPG 193: A Synthetic Korean Power Grid Test System
            for Decarbonization Studies.</em>
          </p>
          <p className="font-mono text-[11px] text-fg-muted">
            arXiv:2411.14756 · {t.footer.fullCitation}{' '}
            <Link to="/methodology" className="inline-flex items-baseline gap-0.5 text-fg underline-offset-4 hover:underline">
              ↗
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            {t.footer.paper} · {t.footer.repository}
          </h4>
          <a
            href="https://arxiv.org/abs/2411.14756"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-accent underline-offset-4 hover:underline"
          >
            arXiv:2411.14756
            <ArrowUpRight size={11} />
          </a>
          <a
            href="https://github.com/kimmjen-kentech/KPG193-advance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted underline-offset-4 hover:underline"
          >
            kimmjen-kentech/KPG193-advance
            <ArrowUpRight size={11} />
          </a>
          <p className="font-mono text-[11px] leading-relaxed text-fg-muted">
            {t.footer.license}
          </p>
        </div>
      </div>
    </footer>
  );
};
