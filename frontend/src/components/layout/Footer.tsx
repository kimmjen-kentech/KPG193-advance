const BIBTEX = `@article{kpg193,
  title  = {KPG 193: A Synthetic Korean Power Grid Test System for Decarbonization Studies},
  journal = {arXiv preprint arXiv:2411.14756},
  year   = {2024}
}`;

export const Footer = () => (
  <footer className="mt-24 border-t border-border bg-bg-elev">
    <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 md:grid-cols-2">
      <div className="space-y-3">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          Citation
        </h4>
        <pre className="overflow-x-auto border border-border bg-bg-subtle p-4 font-mono text-[11px] leading-relaxed text-fg">
          <code>{BIBTEX}</code>
        </pre>
      </div>
      <div className="flex flex-col gap-3">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          References
        </h4>
        <a
          href="https://arxiv.org/abs/2411.14756"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-accent underline-offset-4 hover:underline"
        >
          arXiv:2411.14756
        </a>
        <p className="font-mono text-[11px] leading-relaxed text-fg-muted">
          Dataset licensed under Open Database License (ODbL) v1.0. Site source under the project
          repository.
        </p>
      </div>
    </div>
  </footer>
);
