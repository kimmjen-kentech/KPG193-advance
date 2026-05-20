import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LineSeriesChart } from '../charts/LineSeriesChart';

const twoPoint = (x0: number, y0: number, x1: number, y1: number) => [
  { x: x0, y: y0 },
  { x: x1, y: y1 },
];

describe('LineSeriesChart', () => {
  it('작은 y 범위(0.08 pu)에서 데이터가 차트 전체 높이를 사용한다', () => {
    const { container } = render(
      <LineSeriesChart
        series={[
          {
            name: 'EMT',
            color: 'blue',
            points: twoPoint(0, 1.0, 60, 0.95),
          },
        ]}
        yMin={0.94}
        yMax={1.02}
        width={800}
        height={240}
      />,
    );
    const path = container.querySelector('path')!;
    const d = path.getAttribute('d')!;
    // M x,y L x,y 형태에서 y 좌표 추출
    const yCoords = [...d.matchAll(/[ML]([\d.]+),([\d.]+)/g)].map((m) =>
      parseFloat(m[2]),
    );
    // y=1.0 → 데이터의 75% 위치, y=0.95 → 12.5% 위치 → 두 점 차이가 innerH의 62.5%
    // innerH = 240 - 16 - 24 = 200, 62.5% = 125px
    expect(Math.abs(yCoords[0] - yCoords[1])).toBeGreaterThan(100);
  });

  it('xTicks 배열로 지정한 값이 x축 레이블로 렌더된다', () => {
    const { getByText, queryByText } = render(
      <LineSeriesChart
        series={[
          {
            name: 'f',
            color: 'red',
            points: [
              { x: 0, y: 60 },
              { x: 20, y: 59.64 },
              { x: 60, y: 59.98 },
            ],
          },
        ]}
        xTicks={[0, 20, 40, 60]}
        xLabel={(x) => `${x}s`}
      />,
    );
    expect(getByText('0s')).toBeInTheDocument();
    expect(getByText('20s')).toBeInTheDocument();
    expect(getByText('40s')).toBeInTheDocument();
    expect(getByText('60s')).toBeInTheDocument();
    // 데이터에 없는 값이 기본 샘플링으로 나오면 안 됨
    expect(queryByText('7.6s')).not.toBeInTheDocument();
  });

  it('여러 시리즈가 있어도 x축 레이블이 겹치지 않는다', () => {
    const { getAllByText } = render(
      <LineSeriesChart
        series={[
          { name: 'EMT', color: 'blue', points: twoPoint(0, 1.0, 60, 0.95) },
          { name: 'RMS', color: 'gray', points: twoPoint(0, 1.0, 60, 0.97) },
        ]}
        xTicks={[0, 15, 30, 45, 60]}
        xLabel={(x) => `${x}s`}
      />,
    );
    // 0s는 정확히 1번만 렌더돼야 함 (중복 없음)
    expect(getAllByText('0s')).toHaveLength(1);
  });
});
