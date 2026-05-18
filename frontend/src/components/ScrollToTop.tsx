import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 라우트 전환 시 window 스크롤을 최상단으로 리셋.
 * react-router는 기본적으로 스크롤을 유지하므로 명시적 처리 필요.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};
