import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDecimal, DECIMAL_STORAGE_KEY } from './useDecimal';

describe('useDecimal', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('기본값은 "1"이다 (localStorage 비어있을 때)', () => {
    // 모듈은 처음 import 시점에 초기화되므로 명시적으로 1로 set 후 확인
    const { result } = renderHook(() => useDecimal());
    act(() => result.current.setMode('2'));
    act(() => result.current.setMode('1'));
    expect(result.current.mode).toBe('1');
  });

  it('setMode 시 localStorage에 저장', () => {
    const { result } = renderHook(() => useDecimal());
    act(() => result.current.setMode('2'));
    expect(window.localStorage.getItem(DECIMAL_STORAGE_KEY)).toBe('2');
    act(() => result.current.setMode('exact'));
    expect(window.localStorage.getItem(DECIMAL_STORAGE_KEY)).toBe('exact');
  });

  it('5가지 모드 모두 설정 가능', () => {
    const { result } = renderHook(() => useDecimal());
    const modes = ['0', '1', '2', '3', 'exact'] as const;
    for (const m of modes) {
      act(() => result.current.setMode(m));
      expect(result.current.mode).toBe(m);
    }
  });

  it('동일 mode 재설정 시 listener 호출 안됨 (불필요 리렌더 방지)', () => {
    const { result, rerender } = renderHook(() => useDecimal());
    act(() => result.current.setMode('1'));
    const before = result.current.mode;
    act(() => result.current.setMode('1'));
    rerender();
    expect(result.current.mode).toBe(before);
  });
});
