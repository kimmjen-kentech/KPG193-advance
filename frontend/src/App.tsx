import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ScrollToTop } from './components/ScrollToTop';
import { OverviewPage } from './pages/OverviewPage';
import { DataPage } from './pages/DataPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { GuidePage } from './pages/GuidePage';
import { PinPage } from './pages/PinPage';

const NetworkPage = lazy(() =>
  import('./pages/NetworkPage').then((m) => ({ default: m.NetworkPage })),
);
const ProfilesPage = lazy(() =>
  import('./pages/ProfilesPage').then((m) => ({ default: m.ProfilesPage })),
);

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

const LazyFallback = () => (
  <div className="flex h-[50vh] items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
    loading module …
  </div>
);

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route path="pin" element={<PinPage />} />
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route
            path="network"
            element={
              <Suspense fallback={<LazyFallback />}>
                <NetworkPage />
              </Suspense>
            }
          />
          <Route
            path="profiles"
            element={
              <Suspense fallback={<LazyFallback />}>
                <ProfilesPage />
              </Suspense>
            }
          />
          <Route path="data" element={<DataPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
          <Route path="guide" element={<GuidePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
