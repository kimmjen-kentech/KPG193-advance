import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { NetworkBus, NetworkBranch, NetworkGenerator, NetworkBusGenMix } from '../../lib/queries';

const mkBus = (id: number): NetworkBus => ({
  id,
  lat: 37.0,
  lng: 127.0,
  name_kr: `모선${id}`,
  name_en: `Bus${id}`,
  kv: 345,
  area: 1,
  pd: '500',
  qd: '100',
});

const mkGen = (fuel: 'coal' | 'lng' | 'nuclear', pmax: number): NetworkGenerator => ({
  bus_id: 1,
  fuel,
  pmax_mw: pmax,
  pmax_exact: String(pmax),
  lat: 37.0,
  lng: 127.0,
  name_kr: '모선1',
  name_en: 'Bus1',
});

const mkGenMix = (busId: number, overrides: Partial<NetworkBusGenMix> = {}): NetworkBusGenMix => ({
  bus_id: busId,
  lat: 37.0,
  lng: 127.0,
  coal: 0,
  lng_mw: 0,
  nuclear: 0,
  solar: 0,
  wind: 0,
  hydro: 0,
  total: 0,
  ...overrides,
});

const renderBusDetail = async (
  thermalGens: NetworkGenerator[],
  busGenMix: NetworkBusGenMix | null,
) => {
  const { BusDetail } = await import('../NetworkPage');
  const bus = mkBus(1);
  const busMap = new Map([[1, bus]]);
  return render(
    <MemoryRouter>
      <BusDetail
        bus={bus}
        branches={[] as NetworkBranch[]}
        busMap={busMap}
        thermalGens={thermalGens}
        busGenMix={busGenMix}
        onClose={() => {}}
        onSelectBranch={() => {}}
        onSelectBus={() => {}}
      />
    </MemoryRouter>,
  );
};

describe('BusDetail 발전기 섹션', () => {
  it('화력 발전기가 있을 때 Generators 섹션이 표시된다', async () => {
    await renderBusDetail([mkGen('nuclear', 1200), mkGen('coal', 500)], null);
    expect(screen.getByText(/generators/i)).toBeInTheDocument();
  });

  it('화력 발전기의 연료 타입이 표시된다', async () => {
    await renderBusDetail([mkGen('nuclear', 1200), mkGen('lng', 300)], null);
    expect(screen.getByText('Nuclear')).toBeInTheDocument();
    expect(screen.getByText('LNG')).toBeInTheDocument();
  });

  it('화력 발전기의 Pmax가 표시된다', async () => {
    await renderBusDetail([mkGen('coal', 999)], null);
    expect(screen.getByText(/999.*MW/)).toBeInTheDocument();
  });

  it('발전기가 없으면 Generators 섹션이 표시되지 않는다', async () => {
    await renderBusDetail([], null);
    expect(screen.queryByText(/generators/i)).not.toBeInTheDocument();
  });

  it('IBR 용량이 있을 때 solar/wind/hydro 항목이 표시된다', async () => {
    await renderBusDetail([], mkGenMix(1, { solar: 50, wind: 80, total: 130 }));
    expect(screen.getByText('Solar')).toBeInTheDocument();
    expect(screen.getByText('Wind')).toBeInTheDocument();
  });

  it('IBR 항목이 없으면 표시하지 않는다', async () => {
    await renderBusDetail([], mkGenMix(1, { solar: 0, wind: 0, hydro: 0, total: 0 }));
    expect(screen.queryByText('Solar')).not.toBeInTheDocument();
  });

  it('화력 + IBR 모두 있으면 둘 다 표시된다', async () => {
    await renderBusDetail(
      [mkGen('nuclear', 1200)],
      mkGenMix(1, { solar: 50, total: 1250 }),
    );
    expect(screen.getByText('Nuclear')).toBeInTheDocument();
    expect(screen.getByText('Solar')).toBeInTheDocument();
  });
});
