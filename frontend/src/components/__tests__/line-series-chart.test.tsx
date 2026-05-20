import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LineSeriesChart } from '../charts/LineSeriesChart';

const twoPoint = (x0: number, y0: number, x1: number, y1: number) => [
  { x: x0, y: y0 },
  { x: x1, y: y1 },
];

describe('LineSeriesChart', () => {
  it('series가 비어있어도 크래시하지 않는다', () => {
    const { container } = render(<LineSeriesChart series={[]} />);
    // 빈 series는 null 반환
    expect(container.firstChild).toBeNull();
  });

  it('data가 있으면 차트 컨테이너를 렌더', () => {
    const { container } = render(
      <LineSeriesChart
        series={[{ name: 'f', color: 'red', points: twoPoint(0, 60, 60, 59.64) }]}
        aria-label="freq chart"
      />,
    );
    expect(container.querySelector('[aria-label="freq chart"]')).toBeInTheDocument();
  });

  it('Recharts ResponsiveContainer가 렌더된다', () => {
    const { container } = render(
      <LineSeriesChart
        series={[{ name: 'f', color: 'red', points: twoPoint(0, 60, 60, 59.64) }]}
      />,
    );
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('여러 시리즈를 모두 받아서 렌더', () => {
    const { container } = render(
      <LineSeriesChart
        series={[
          { name: 'EMT', color: 'blue', points: twoPoint(0, 1.0, 60, 0.95) },
          { name: 'RMS', color: 'gray', points: twoPoint(0, 1.0, 60, 0.97) },
        ]}
        showLegend
      />,
    );
    // ResponsiveContainer + 차트 컨테이너 존재
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});
