import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleToggle } from '../LocaleToggle';
import { DecimalToggle } from '../DecimalToggle';
import { Skeleton } from '../ui/Skeleton';
import { LOCALE_STORAGE_KEY } from '../../hooks/useI18n';
import { DECIMAL_STORAGE_KEY } from '../../hooks/useDecimal';

describe('LocaleToggle', () => {
  beforeEach(() => window.localStorage.clear());

  it('KO / EN 두 버튼을 렌더한다', () => {
    render(<LocaleToggle />);
    expect(screen.getByRole('button', { name: /ko/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /en/i })).toBeInTheDocument();
  });

  it('클릭 시 localStorage에 저장', async () => {
    const user = userEvent.setup();
    render(<LocaleToggle />);
    // 초기 locale 상관없이 두 모드를 명시적으로 전환하며 저장 검증
    await user.click(screen.getByRole('button', { name: /ko 로 전환/i }));
    await user.click(screen.getByRole('button', { name: /en 로 전환/i }));
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
    await user.click(screen.getByRole('button', { name: /ko 로 전환/i }));
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('ko');
  });
});

describe('DecimalToggle', () => {
  beforeEach(() => window.localStorage.clear());

  it('4가지 모드 버튼을 렌더한다 (0 / .0 / .00 / ∞)', () => {
    render(<DecimalToggle />);
    expect(screen.getByTitle('0 decimals')).toBeInTheDocument();
    expect(screen.getByTitle('1 decimal')).toBeInTheDocument();
    expect(screen.getByTitle('2 decimals')).toBeInTheDocument();
    expect(screen.getByTitle('Exact (preserve precision)')).toBeInTheDocument();
  });

  it('클릭 시 localStorage에 저장', async () => {
    const user = userEvent.setup();
    render(<DecimalToggle />);
    await user.click(screen.getByTitle('2 decimals'));
    expect(window.localStorage.getItem(DECIMAL_STORAGE_KEY)).toBe('2');
    await user.click(screen.getByTitle('Exact (preserve precision)'));
    expect(window.localStorage.getItem(DECIMAL_STORAGE_KEY)).toBe('exact');
  });
});

describe('Skeleton', () => {
  it('animate-pulse 클래스를 가진다', () => {
    const { container } = render(<Skeleton className="h-4 w-8" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('animate-pulse');
  });

  it('aria-hidden 속성으로 스크린리더에 노출되지 않는다', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});
