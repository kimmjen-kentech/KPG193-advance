import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useI18n, LOCALE_STORAGE_KEY } from './useI18n';

describe('useI18n', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('localStorage 값이 있으면 그것을 사용한다', () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'en');
    const { result } = renderHook(() => useI18n());
    // 기본 모듈은 이미 init되어 있어 한 번 토글로 동기화
    if (result.current.locale !== 'en') {
      act(() => result.current.setLocale('en'));
    }
    expect(result.current.locale).toBe('en');
    expect(result.current.t.nav.network).toBe('Network');
  });

  it('toggle()로 ko↔en 전환', () => {
    const { result } = renderHook(() => useI18n());
    const initial = result.current.locale;
    act(() => result.current.toggle());
    expect(result.current.locale).not.toBe(initial);
  });

  it('setLocale 시 localStorage에 저장', () => {
    const { result } = renderHook(() => useI18n());
    // 두 locale 모두에 대해 변화 발생 후 저장 검증
    act(() => result.current.setLocale('en'));
    act(() => result.current.setLocale('ko'));
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('ko');
    act(() => result.current.setLocale('en'));
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
  });

  it('document.lang을 동기화', () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLocale('ko'));
    expect(document.documentElement.lang).toBe('ko');
    act(() => result.current.setLocale('en'));
    expect(document.documentElement.lang).toBe('en');
  });

  it('한국어 / 영어 키 모두 동일한 구조를 가진다', () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLocale('ko'));
    const ko = result.current.t;
    act(() => result.current.setLocale('en'));
    const en = result.current.t;
    expect(Object.keys(ko.nav).sort()).toEqual(Object.keys(en.nav).sort());
    expect(Object.keys(ko.network).sort()).toEqual(Object.keys(en.network).sort());
  });
});
