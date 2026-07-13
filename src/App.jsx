import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGame } from './context/GameContext';
import ParticleBackground from './components/ParticleBackground';

// Pages
import Onboarding from './pages/Onboarding';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';

// Games
import NeonRunner from './games/NeonRunner';
import ReflexMaster from './games/ReflexMaster';
import MemoryClash from './games/MemoryClash';
import SpaceSurvivor from './games/SpaceSurvivor';
import ColorRush from './games/ColorRush';
import ShadowNinja from './games/ShadowNinja';
import ArcheryHero from './games/ArcheryHero';
import NeonSnake from './games/NeonSnake';
import NeonBreaker from './games/NeonBreaker';

const ProtectedRoute = ({ children }) => {
  const { userName } = useGame();
  if (!userName) return <Navigate to="/onboarding" />;
  return children;
};

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <ParticleBackground />
      <div className="main-content">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

const App = () => {
  const { userName, hasSeenIntro } = useGame();

  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={
          !userName ? <Onboarding /> : (hasSeenIntro ? <Navigate to="/app/home" /> : <Navigate to="/intro" />)
        } />
        
        <Route path="/intro" element={
          userName && !hasSeenIntro ? <Intro /> : <Navigate to={userName ? "/app/home" : "/onboarding"} />
        } />
        
        <Route path="/app/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="games" element={<Games />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="home" />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/game/*" element={
          <ProtectedRoute>
            <Routes>
              <Route path="neonRunner" element={<NeonRunner />} />
              <Route path="reflexMaster" element={<ReflexMaster />} />
              <Route path="memoryClash" element={<MemoryClash />} />
              <Route path="spaceSurvivor" element={<SpaceSurvivor />} />
              <Route path="colorRush" element={<ColorRush />} />
              <Route path="shadowNinja" element={<ShadowNinja />} />
              <Route path="archeryHero" element={<ArcheryHero />} />
              <Route path="neonSnake" element={<NeonSnake />} />
              <Route path="neonBreaker" element={<NeonBreaker />} />
            </Routes>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to={userName ? "/app/home" : "/onboarding"} />} />
      </Routes>
      <InstallPrompt />
    </Router>
  );
};

export default App;
