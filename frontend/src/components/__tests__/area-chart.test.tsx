import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AreaChart } from '../charts/AreaChart';

const hourData = Array.from({ length: 24 }, (_, i) => ({ x: i + 1, y: (i + 1) * 100 }));

describe('AreaChart', () => {
  it('xTicks 배열로 지정한 값이 x축 레이블로 렌더된다', () => {
    const { getByText, queryByText } = render(
      <AreaChart
        data={hourData}
        xTicks={[1, 4, 8, 12, 16, 20, 24]}
        xLabel={(x) => `${x}h`}
      />,
    );
    expect(getByText('1h')).toBeInTheDocument();
    expect(getByText('12h')).toBeInTheDocument();
    expect(getByText('24h')).toBeInTheDocument();
    expect(queryByText('7h')).not.toBeInTheDocument();
  });

  it('xTicks 없으면 데이터 포인트 샘플링으로 레이블을 렌더한다', () => {
    const { container } = render(
      <AreaChart data={hourData} xLabel={(x) => `${x}h`} />,
    );
    const texts = [...container.querySelectorAll('text')].map((el) => el.textContent);
    expect(texts.some((t) => t?.endsWith('h'))).toBe(true);
  });

  it('SVG에 preserveAspectRatio=none이 설정된다', () => {
    const { container } = render(<AreaChart data={hourData} />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('preserveAspectRatio')).toBe('none');
  });
});
