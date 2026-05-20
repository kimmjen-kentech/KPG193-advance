import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { commitmentByFuelSQL } from '../../lib/queries';
import { useI18n } from '../../hooks/useI18n';

describe('commitmentByFuelSQL', () => {
  it('busId 없이 호출 시 bus 필터 조건이 없다', () => {
    const sql = commitmentByFuelSQL(1);
    expect(sql).not.toMatch(/AND g\.bus_id/);
  });

  it('busId=null 로 호출 시 bus 필터 조건이 없다', () => {
    const sql = commitmentByFuelSQL(1, null);
    expect(sql).not.toMatch(/AND g\.bus_id/);
  });

  it('busId 지정 시 해당 bus 필터가 WHERE 절에 포함된다', () => {
    const sql = commitmentByFuelSQL(42, 7);
    expect(sql).toMatch(/AND g\.bus_id = 7/);
  });

  it('busId 지정 시 day 필터도 유지된다', () => {
    const sql = commitmentByFuelSQL(42, 7);
    expect(sql).toMatch(/c\.day = 42/);
  });

  it('서로 다른 bus_id는 각각 다른 SQL을 생성한다', () => {
    const sql5 = commitmentByFuelSQL(1, 5);
    const sql10 = commitmentByFuelSQL(1, 10);
    expect(sql5).toMatch(/AND g\.bus_id = 5/);
    expect(sql10).toMatch(/AND g\.bus_id = 10/);
    expect(sql5).not.toMatch(/AND g\.bus_id = 10/);
  });
});

describe('ProfilesPage commitment 타이틀 로직', () => {
  beforeEach(() => {
    window.localStorage.clear();
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

  it('버스 미선택(system-wide) 시 차트 제목에 "system-wide"가 포함된다', async () => {
    await renderProfilesEn();
    const title = screen.getByText(/Thermal Commitment.*system-wide/i);
    expect(title).toBeInTheDocument();
  });
});
