import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';

vi.mock('../../hooks/useQuery', () => ({
  useQuery: vi.fn(),
}));

type QueryState = { data: unknown[] | null; error: Error | null; loading: boolean };

const ok: QueryState = { data: [], error: null, loading: false };

const setupUseQuery = async (overrides: {
  demand?: QueryState;
  renewables?: QueryState;
  commitment?: QueryState;
}) => {
  const { useQuery } = await import('../../hooks/useQuery');
  vi.mocked(useQuery).mockImplementation((sql: string) => {
    if (sql.includes('profile_demand')) return overrides.demand ?? ok;
    if (sql.includes('profile_renewables')) return overrides.renewables ?? ok;
    if (sql.includes('profile_commitment')) return overrides.commitment ?? ok;
    return ok;
  });
};

describe('ProfilesPage 에러 표시', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  const renderProfilesEn = async () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLocale('en'));
    const { ProfilesPage } = await import('../ProfilesPage');
    return render(
      <MemoryRouter>
        <ProfilesPage />
      </MemoryRouter>,
    );
  };

  it('demand 쿼리 실패 시 에러 메시지를 표시한다', async () => {
    await setupUseQuery({
      demand: { data: null, error: new Error('demand failed'), loading: false },
    });
    await renderProfilesEn();
    expect(screen.getByText(/demand failed/i)).toBeInTheDocument();
  });

  it('renewables 쿼리 실패 시 에러 메시지를 표시한다', async () => {
    await setupUseQuery({
      renewables: { data: null, error: new Error('renewables failed'), loading: false },
    });
    await renderProfilesEn();
    expect(screen.getByText(/renewables failed/i)).toBeInTheDocument();
  });

  it('commitment 쿼리 실패 시 에러 메시지를 표시한다', async () => {
    await setupUseQuery({
      commitment: { data: null, error: new Error('commitment failed'), loading: false },
    });
    await renderProfilesEn();
    expect(screen.getByText(/commitment failed/i)).toBeInTheDocument();
  });
});
