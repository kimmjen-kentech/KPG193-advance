import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BusDetail } from '../BusDetail';
import { BranchDetail } from '../BranchDetail';
import { BusList } from '../BusList';
import type { NetworkBus, NetworkBranch } from '../../../lib/queries';

const mockBus: NetworkBus = {
  id: 1,
  lat: 37.5,
  lng: 127.0,
  name_kr: '서울변전소',
  name_en: 'Seoul Substation',
  kv: 345,
  area: 1,
  pd: '1200.5',
  qd: '300.2',
};

const mockBus2: NetworkBus = {
  id: 2,
  lat: 37.6,
  lng: 127.1,
  name_kr: '경기변전소',
  name_en: 'Gyeonggi Substation',
  kv: 154,
  area: 1,
  pd: '800.0',
  qd: '150.0',
};

const mockBranch: NetworkBranch = {
  from_id: 1,
  to_id: 2,
  from_lat: 37.5,
  from_lng: 127.0,
  to_lat: 37.6,
  to_lng: 127.1,
  kv: 345,
  rate_mva: '500.0',
};

const busMap = new Map<number, NetworkBus>([[1, mockBus], [2, mockBus2]]);

describe('BusDetail', () => {
  const noop = vi.fn();

  it('버스 이름과 kV를 표시한다', () => {
    render(
      <BusDetail
        bus={mockBus}
        branches={[mockBranch]}
        busMap={busMap}
        onClose={noop}
        onSelectBranch={noop}
        onSelectBus={noop}
      />,
    );
    expect(screen.getByText(/서울변전소/)).toBeInTheDocument();
    expect(screen.getByText('345 kV')).toBeInTheDocument();
  });

  it('연결된 브랜치 수를 표시한다', () => {
    render(
      <BusDetail
        bus={mockBus}
        branches={[mockBranch, mockBranch]}
        busMap={busMap}
        onClose={noop}
        onSelectBranch={noop}
        onSelectBus={noop}
      />,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

describe('BranchDetail', () => {
  const noop = vi.fn();

  it('브랜치 kV와 From/To 레이블을 표시한다', () => {
    render(
      <BranchDetail
        branch={mockBranch}
        connected={[]}
        busMap={busMap}
        onClose={noop}
        onSelectBranch={noop}
        onSelectBus={noop}
      />,
    );
    expect(screen.getAllByText('345 kV').length).toBeGreaterThan(0);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
  });
});

describe('BusList', () => {
  it('버스 목록을 렌더한다', () => {
    const onSelect = vi.fn();
    render(<BusList buses={[mockBus, mockBus2]} onSelect={onSelect} />);
    expect(screen.getByText('서울변전소')).toBeInTheDocument();
    expect(screen.getByText('경기변전소')).toBeInTheDocument();
  });

  it('ID 포맷이 3자리 패딩으로 표시된다', () => {
    render(<BusList buses={[mockBus]} onSelect={vi.fn()} />);
    expect(screen.getByText('#001')).toBeInTheDocument();
  });
});
