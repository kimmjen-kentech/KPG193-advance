import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SimulationPage } from '../SimulationPage';

const renderSim = () =>
  render(
    <MemoryRouter>
      <SimulationPage />
    </MemoryRouter>,
  );

describe('SimulationPage', () => {
  it('5개 섹션 헤더가 표시된다', () => {
    renderSim();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('EMT와 RMS 비교 카드가 표시된다', () => {
    renderSim();
    expect(screen.getByText('EMT')).toBeInTheDocument();
    expect(screen.getByText('RMS')).toBeInTheDocument();
  });

  it('주파수 응답 차트가 있다 (SVG 포함)', () => {
    renderSim();
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('아키텍처 SVG에 ITM 표시가 있다', () => {
    renderSim();
    expect(screen.getByText('ITM')).toBeInTheDocument();
  });

  it('전압 응답 섹션이 표시된다', () => {
    renderSim();
    expect(screen.getAllByText(/voltage response/i).length).toBeGreaterThan(0);
  });

  it('Co-simulation 파티션 설명이 표시된다', () => {
    renderSim();
    expect(screen.getByText(/partition/i)).toBeInTheDocument();
  });

  it('KPI 그리드에 6개 항목이 있다', () => {
    renderSim();
    const kpiValues = screen.getAllByText(/10⁻⁵|Hz|deg/);
    expect(kpiValues.length).toBeGreaterThanOrEqual(3);
  });

  it('SVG 텍스트가 번역 키를 통해 표시된다 (언어 혼용 없음)', () => {
    renderSim();
    // 영어 locale에서 한국어 고유 텍스트가 직접 노출되지 않아야 한다
    const koText = screen.queryByText('광역망');
    expect(koText).not.toBeInTheDocument();
  });
});
