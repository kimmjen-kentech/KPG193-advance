import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AreaChart } from '../charts/AreaChart';
import { LineSeriesChart } from '../charts/LineSeriesChart';
import { Footer } from '../layout/Footer';

const pts = [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1.5 }];

describe('AreaChart accessibility', () => {
  it('SVG에 role=img가 있다', () => {
    render(<AreaChart data={pts} aria-label="Test chart" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('aria-label이 SVG에 설정된다', () => {
    render(<AreaChart data={pts} aria-label="Demand profile" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Demand profile');
  });
});

describe('LineSeriesChart accessibility', () => {
  const series = [{ name: 'A', color: '#000', points: pts }];

  it('SVG에 role=img가 있다', () => {
    render(<LineSeriesChart series={series} aria-label="Test line chart" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('aria-label이 SVG에 설정된다', () => {
    render(<LineSeriesChart series={series} aria-label="Frequency response" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Frequency response');
  });
});

describe('Footer accessibility', () => {
  it('arXiv 링크에 접근 가능한 이름이 있다', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    const arxivLink = screen.getByRole('link', { name: /arxiv/i });
    expect(arxivLink).toBeInTheDocument();
  });

  it('방법론 내부 링크에 aria-label이 있다', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    const methodLink = screen.getByRole('link', { name: /methodology/i });
    expect(methodLink).toBeInTheDocument();
  });
});
