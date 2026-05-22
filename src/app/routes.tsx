import { Routes, Route, Outlet } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Dashboard } from '../pages/Dashboard';
import { Roadmap } from '../pages/Roadmap';
import { ReactModule } from '../pages/ReactModule';
import { BackendModule } from '../pages/BackendModule';
import { ErrorSimulator } from '../pages/ErrorSimulator';
import { InterviewArena } from '../pages/InterviewArena';
import { ApiVisualizer } from '../pages/ApiVisualizer';
import { Profile } from '../pages/Profile';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

// Layout wrapper for all inner dashboard paths
function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-text-main">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Home is outside the main dashboard sidebar frame */}
      <Route path="/" element={<Home />} />
      
      {/* Dashboard frame routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/react" element={<ReactModule />} />
        <Route path="/backend" element={<BackendModule />} />
        <Route path="/errors" element={<ErrorSimulator />} />
        <Route path="/interview" element={<InterviewArena />} />
        <Route path="/api-visualizer" element={<ApiVisualizer />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
