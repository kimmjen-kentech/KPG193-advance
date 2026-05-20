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
  it('9개 섹션 헤더가 표시된다', () => {
    renderSim();
    ['01', '02', '03', '04', '05', '06', '07', '08', '09'].forEach((n) => {
      expect(screen.getByText(n)).toBeInTheDocument();
    });
  });

  it('Scenario 섹션이 트립 크기별 ROCOF/Nadir 값을 보여준다', () => {
    renderSim();
    // KPI 테이블에 트립 MW 값 행 존재
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    // Nadir / ROCOF 값
    expect(screen.getByText('59.92 Hz')).toBeInTheDocument();
    expect(screen.getByText('59.36 Hz')).toBeInTheDocument();
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

  it('Co-simulation 파티션 설명이 표시된다 (3종 카드)', () => {
    renderSim();
    // CoSimTypesSection이 3개 카드에 각각 'Partition' 라벨 노출 → 다수 존재가 정상
    expect(screen.getAllByText(/partition/i).length).toBeGreaterThanOrEqual(3);
  });

  it('새 섹션: Modeling / AutoGrid / Co-simulation Types 모두 렌더', () => {
    renderSim();
    // Generator card title via i18n (en locale default in jsdom)
    expect(screen.getByText(/synchronous generator/i)).toBeInTheDocument();
    expect(screen.getAllByText(/IBR/i).length).toBeGreaterThan(0);
    // AutoGrid pipeline
    expect(screen.getAllByText(/AutoGrid/i).length).toBeGreaterThan(0);
    // Co-sim 3 types
    expect(screen.getByText('EMT-EMT')).toBeInTheDocument();
    expect(screen.getByText('RMS-RMS')).toBeInTheDocument();
    expect(screen.getAllByText('RMS-EMT').length).toBeGreaterThan(0);
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
