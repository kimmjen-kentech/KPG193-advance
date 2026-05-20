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
        series={[{ name: 'EMT', color: 'blue', points: twoPoint(0, 1.0, 60, 0.95) }]}
        yMin={0.94}
        yMax={1.02}
        width={800}
        height={240}
      />,
    );
    const path = container.querySelector('path')!;
    const d = path.getAttribute('d')!;
    const yCoords = [...d.matchAll(/[ML]([\d.]+),([\d.]+)/g)].map((m) => parseFloat(m[2]));
    expect(Math.abs(yCoords[0] - yCoords[1])).toBeGreaterThan(100);
  });

  it('xTicks 배열로 지정한 값이 x축 레이블로 렌더된다', () => {
    const { getByText, queryByText } = render(
      <LineSeriesChart
        series={[
          {
            name: 'f',
            color: 'red',
            points: [{ x: 0, y: 60 }, { x: 20, y: 59.64 }, { x: 60, y: 59.98 }],
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
    expect(getAllByText('0s')).toHaveLength(1);
  });

  it('showLegend=true이면 시리즈 이름이 SVG 안에 렌더된다', () => {
    const { getByText } = render(
      <LineSeriesChart
        series={[
          { name: 'EMT zone', color: 'blue', points: twoPoint(0, 1.0, 60, 0.95) },
          { name: 'RMS zone', color: 'gray', points: twoPoint(0, 1.0, 60, 0.97) },
        ]}
        showLegend
      />,
    );
    expect(getByText('EMT zone')).toBeInTheDocument();
    expect(getByText('RMS zone')).toBeInTheDocument();
  });

  it('vLine이 있으면 해당 x 위치에 line 엘리먼트가 렌더된다', () => {
    const { container } = render(
      <LineSeriesChart
        series={[{ name: 'f', color: 'red', points: twoPoint(0, 60, 60, 59.64) }]}
        vLine={{ x: 20, label: 'Trip' }}
      />,
    );
    // SVG에 dashed line 존재
    const dashedLines = [...container.querySelectorAll('line')].filter(
      (l) => l.getAttribute('stroke-dasharray'),
    );
    expect(dashedLines.length).toBeGreaterThan(0);
    // 레이블도 렌더
    expect(container.querySelector('svg')!.textContent).toContain('Trip');
  });

  it('strokeDasharray가 있는 시리즈는 해당 패턴으로 path를 렌더한다', () => {
    const { container } = render(
      <LineSeriesChart
        series={[
          { name: 'solid', color: 'blue', points: twoPoint(0, 1.0, 10, 0.9) },
          { name: 'dashed', color: 'blue', strokeDasharray: '6 3', points: twoPoint(0, 1.0, 10, 0.92) },
        ]}
      />,
    );
    const paths = [...container.querySelectorAll('path')];
    const dashedPath = paths.find((p) => p.getAttribute('stroke-dasharray') === '6 3');
    expect(dashedPath).toBeTruthy();
  });

  it('fill=true 시리즈는 닫힌 path(area)와 선 path를 모두 렌더한다', () => {
    const { container } = render(
      <LineSeriesChart
        series={[{ name: 'solar', color: 'orange', fill: true, points: twoPoint(0, 0, 12, 0.8) }]}
      />,
    );
    const paths = container.querySelectorAll('path');
    // fill path + line path = 2
    expect(paths.length).toBeGreaterThanOrEqual(2);
    const fillPath = [...paths].find((p) => p.getAttribute('fill') !== 'none');
    expect(fillPath).toBeTruthy();
  });
});
