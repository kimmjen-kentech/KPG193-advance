import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { profileWeatherSQL } from '../../lib/queries';
import { useI18n } from '../../hooks/useI18n';

vi.mock('../../hooks/useQuery', () => ({
  useQuery: vi.fn(),
}));

describe('profileWeatherSQL', () => {
  it('day 필터를 포함한다', () => {
    const sql = profileWeatherSQL(42);
    expect(sql).toMatch(/day = 42/);
  });

  it('busId=null 이면 bus 필터가 없다', () => {
    const sql = profileWeatherSQL(1, null);
    expect(sql).not.toMatch(/AND bus_id/);
  });

  it('busId 지정 시 bus 필터를 포함한다', () => {
    const sql = profileWeatherSQL(1, 5);
    expect(sql).toMatch(/AND bus_id = 5/);
  });

  it('temperature_2m_K 컬럼을 조회한다', () => {
    const sql = profileWeatherSQL(1);
    expect(sql).toMatch(/temperature_2m_K/);
  });

  it('wind_speed 컬럼을 조회한다', () => {
    const sql = profileWeatherSQL(1);
    expect(sql).toMatch(/wind_speed/);
  });
});

describe('ProfilesPage 날씨 섹션', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  const renderProfilesEn = async () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLocale('en'));
    const { useQuery } = await import('../../hooks/useQuery');
    vi.mocked(useQuery).mockImplementation((sql: string) => {
      if (sql.includes('profile_weather')) {
        return {
          data: [
            { hour: 1, temp_c: 15.5, wind_speed: 3.2 },
            { hour: 2, temp_c: 14.8, wind_speed: 2.9 },
          ],
          error: null,
          loading: false,
        };
      }
      return { data: [], error: null, loading: false };
    });
    const { ProfilesPage } = await import('../ProfilesPage');
    return render(
      <MemoryRouter>
        <ProfilesPage />
      </MemoryRouter>,
    );
  };

  it('날씨 섹션 제목이 표시된다', async () => {
    await renderProfilesEn();
    expect(screen.getByText(/weather/i)).toBeInTheDocument();
  });

  it('기온 레이블이 표시된다', async () => {
    await renderProfilesEn();
    expect(screen.getByText(/temperature/i)).toBeInTheDocument();
  });

  it('풍속 레이블이 표시된다', async () => {
    await renderProfilesEn();
    expect(screen.getByText(/wind speed/i)).toBeInTheDocument();
  });
});
