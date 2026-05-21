import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApplicationsPage } from '../ApplicationsPage';

const renderApp = () =>
  render(
    <MemoryRouter>
      <ApplicationsPage />
    </MemoryRouter>,
  );

describe('ApplicationsPage', () => {
  it('6개 섹션 헤더가 모두 표시된다', () => {
    renderApp();
    ['01', '02', '03', '04', '05', '06'].forEach((n) => {
      expect(screen.getByText(n)).toBeInTheDocument();
    });
  });

  it('Hero 헤더가 렌더된다', () => {
    renderApp();
    // i18n 기본 en locale (jsdom)에서 title "Applications." 확인
    expect(screen.getByText(/^Applications\.$/)).toBeInTheDocument();
  });

  it('Coal Phaseout 카드에 estimation 배지가 있다', () => {
    renderApp();
    expect(screen.getByText(/estimation/i)).toBeInTheDocument();
  });

  it('두 슬라이더(Coal phaseout, Renewable expansion)가 존재한다', () => {
    renderApp();
    const sliders = screen.getAllByRole('slider');
    // RE Potential day slider + Coal phaseout + RE expansion = 3
    expect(sliders.length).toBeGreaterThanOrEqual(3);
  });

  it('IEA 출처 각주가 표시된다 (Coal Phaseout)', () => {
    renderApp();
    expect(screen.getByText(/IEA Emissions Factors/i)).toBeInTheDocument();
  });

  it('Capacity Factor 섹션에 상한선 노트가 있다', () => {
    renderApp();
    expect(screen.getAllByText(/upper bound/i).length).toBeGreaterThanOrEqual(1);
  });
});
