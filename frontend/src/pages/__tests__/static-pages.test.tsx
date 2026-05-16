import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataPage } from '../DataPage';
import { MethodologyPage } from '../MethodologyPage';
import { GuidePage } from '../GuidePage';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('DataPage', () => {
  it('헤더와 카탈로그 통계를 렌더한다', () => {
    renderWithRouter(<DataPage />);
    expect(screen.getByRole('heading', { name: /^Data\.$/ })).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('ODbL 1.0')).toBeInTheDocument();
  });

  it('13개 Parquet 파일에 대한 다운로드 링크가 있다', () => {
    renderWithRouter(<DataPage />);
    const downloadLinks = screen.getAllByText('Download');
    expect(downloadLinks.length).toBe(13);
  });

  it('각 다운로드 링크는 .parquet href와 download 속성을 가진다', () => {
    renderWithRouter(<DataPage />);
    const link = screen
      .getAllByText('Download')[0]
      .closest('a') as HTMLAnchorElement;
    expect(link).toHaveAttribute('download');
    expect(link.getAttribute('href')).toMatch(/\.parquet$/);
  });
});

describe('MethodologyPage', () => {
  it('논문 참조와 BibTeX를 렌더한다', () => {
    renderWithRouter(<MethodologyPage />);
    expect(screen.getByRole('heading', { name: /^Methodology\.$/ })).toBeInTheDocument();
    expect(screen.getByText(/Song, Geonho & Kim, Jip/)).toBeInTheDocument();
    expect(screen.getByText(/@article\{song2024kpg193/)).toBeInTheDocument();
  });

  it('arXiv 링크가 새 탭으로 열린다', () => {
    renderWithRouter(<MethodologyPage />);
    const arxiv = screen.getByText(/arXiv:2411\.14756/, { selector: 'a' });
    expect(arxiv).toHaveAttribute('href', 'https://arxiv.org/abs/2411.14756');
    expect(arxiv).toHaveAttribute('target', '_blank');
  });

  it('Construction Pipeline 4단계를 표시한다', () => {
    renderWithRouter(<MethodologyPage />);
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
    expect(screen.getByText('Spatial Clustering')).toBeInTheDocument();
    expect(screen.getByText('Parameter Estimation')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
  });
});

describe('GuidePage', () => {
  it('Julia / Python / MATLAB 탭을 표시한다', () => {
    renderWithRouter(<GuidePage />);
    expect(screen.getByRole('heading', { name: /^Guide\.$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Julia/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Python/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /MATLAB/ })).toBeInTheDocument();
  });

  it('기본 활성 탭은 Python이다', () => {
    renderWithRouter(<GuidePage />);
    expect(screen.getByText(/import scipy\.io/)).toBeInTheDocument();
  });

  it('Julia 탭 클릭 시 Julia 코드를 노출한다', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    renderWithRouter(<GuidePage />);
    await user.click(screen.getByRole('button', { name: /Julia/ }));
    expect(screen.getByText(/using MAT, DataFrames/)).toBeInTheDocument();
  });
});
