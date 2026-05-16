import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DataPage } from './pages/DataPage';
import { GuidePage } from './pages/GuidePage';
import { MethodologyPage } from './pages/MethodologyPage';
import { NetworkPage } from './pages/NetworkPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProfilesPage } from './pages/ProfilesPage';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="profiles" element={<ProfilesPage />} />
          <Route path="data" element={<DataPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
          <Route path="guide" element={<GuidePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
