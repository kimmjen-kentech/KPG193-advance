import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { translations } from '../../i18n/translations';
import { useI18n } from '../../hooks/useI18n';

describe('translations.network.busList', () => {
  it('ko에 busList 키가 있다', () => {
    expect(translations.ko.network.busList).toBeTruthy();
  });

  it('en에 busList 키가 있다', () => {
    expect(translations.en.network.busList).toBeTruthy();
  });
});

describe('translations.pin', () => {
  const REQUIRED_KEYS = ['title', 'sub', 'digitLabel', 'textLabel', 'errorMsg', 'submitLabel', 'submitLoading'] as const;

  it('ko pin 섹션에 필수 키가 모두 있다', () => {
    for (const key of REQUIRED_KEYS) {
      expect(translations.ko.pin[key]).toBeTruthy();
    }
  });

  it('en pin 섹션에 필수 키가 모두 있다', () => {
    for (const key of REQUIRED_KEYS) {
      expect(translations.en.pin[key]).toBeTruthy();
    }
  });

  it('ko와 en pin 섹션의 키 구조가 동일하다', () => {
    expect(Object.keys(translations.ko.pin).sort()).toEqual(Object.keys(translations.en.pin).sort());
  });
});

describe('PinPage i18n', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const renderPin = async (locale: 'ko' | 'en') => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLocale(locale));
    const { PinPage } = await import('../PinPage');
    return render(
      <MemoryRouter>
        <PinPage />
      </MemoryRouter>,
    );
  };

  it('en 로케일에서 "Private Preview" 타이틀을 표시한다', async () => {
    await renderPin('en');
    expect(screen.getByRole('heading', { name: 'Private Preview' })).toBeInTheDocument();
  });

  it('ko 로케일에서 "접근 제한" 타이틀을 표시한다', async () => {
    await renderPin('ko');
    expect(screen.getByRole('heading', { name: '접근 제한' })).toBeInTheDocument();
  });

  it('en 로케일에서 "4 digits" 레이블을 표시한다', async () => {
    await renderPin('en');
    expect(screen.getByText('4 digits')).toBeInTheDocument();
  });

  it('ko 로케일에서 "숫자 4자리" 레이블을 표시한다', async () => {
    await renderPin('ko');
    expect(screen.getByText('숫자 4자리')).toBeInTheDocument();
  });
});
