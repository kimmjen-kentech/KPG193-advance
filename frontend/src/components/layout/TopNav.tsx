import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { ThemeToggle } from '../ThemeToggle';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.93c.57.1.78-.25.78-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

const NAV_ITEMS = [
  { to: '/', label: 'Index', end: true },
  { to: '/network', label: 'Network' },
  { to: '/profiles', label: 'Profiles' },
  { to: '/data', label: 'Data' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/guide', label: 'Guide' },
];

export const TopNav = () => (
  <nav className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
    <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6">
      <div className="flex items-center gap-10">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-fg text-bg">
            <span className="font-mono text-[10px] font-bold leading-none">KPG</span>
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className="font-mono text-sm font-bold uppercase leading-none tracking-tight text-fg">
              193_TESTBED
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
              v1.5_STABLE
            </span>
          </div>
        </NavLink>

        <div className="hidden gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative flex h-14 items-center font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors',
                  isActive
                    ? 'text-fg after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-fg'
                    : 'text-fg-subtle hover:text-fg',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href="https://github.com/agm-center/kpg-testgrid"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          className="inline-flex h-8 w-8 items-center justify-center border border-border text-fg transition-colors hover:bg-bg-subtle"
        >
          <GithubIcon size={14} />
        </a>
      </div>
    </div>
  </nav>
);
