import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AreaChart } from '../charts/AreaChart';

const hourData = Array.from({ length: 24 }, (_, i) => ({ x: i + 1, y: (i + 1) * 100 }));

describe('AreaChart', () => {
  it('data 없이는 null을 렌더', () => {
    const { container } = render(<AreaChart data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('data가 있으면 차트 컨테이너를 렌더', () => {
    const { container } = render(<AreaChart data={hourData} aria-label="test chart" />);
    expect(container.querySelector('[aria-label="test chart"]')).toBeInTheDocument();
  });

  it('SVG가 내부에 렌더된다 (Recharts ResponsiveContainer + AreaChart)', () => {
    const { container } = render(<AreaChart data={hourData} />);
    // Recharts는 ResponsiveContainer의 자식으로 SVG를 만든다
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});
