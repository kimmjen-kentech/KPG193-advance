import { describe, it, expect } from 'vitest';
import { translations } from '../../i18n/translations';

describe('Applications i18n 키 동일성 (ko/en)', () => {
  it('nav.applications가 ko/en 모두 존재한다', () => {
    expect(translations.ko.nav.applications).toBeTruthy();
    expect(translations.en.nav.applications).toBeTruthy();
  });

  it('applications 네임스페이스 최상위 키가 ko/en 동일', () => {
    const ko = Object.keys(translations.ko.applications).sort();
    const en = Object.keys(translations.en.applications).sort();
    expect(ko).toEqual(en);
  });

  it('sections 6개 키가 ko/en 동일', () => {
    const ko = Object.keys(translations.ko.applications.sections).sort();
    const en = Object.keys(translations.en.applications.sections).sort();
    expect(ko).toEqual(en);
    expect(ko).toHaveLength(6);
  });

  const subKeys: Array<keyof typeof translations.ko.applications> = [
    'decarb', 'potential', 'netLoad', 'phaseout', 'expansion', 'cf',
  ];
  for (const k of subKeys) {
    it(`applications.${k} 하위 키가 ko/en 동일`, () => {
      const ko = Object.keys(translations.ko.applications[k] as Record<string, unknown>).sort();
      const en = Object.keys(translations.en.applications[k] as Record<string, unknown>).sort();
      expect(ko).toEqual(en);
    });
  }
});
