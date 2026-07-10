import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2, Trophy, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/app/home', icon: <Home size={24} />, label: 'Home' },
    { path: '/app/games', icon: <Gamepad2 size={24} />, label: 'Games' },
    { path: '/app/leaderboard', icon: <Trophy size={24} />, label: 'Reyting' },
    { path: '/app/profile', icon: <User size={24} />, label: 'Profil' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '70px',
      background: 'rgba(10, 11, 16, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(0, 240, 255, 0.2)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive ? 'var(--neon-blue)' : 'var(--text-secondary)',
            textShadow: isActive ? '0 0 10px rgba(0, 240, 255, 0.7)' : 'none',
            transition: 'all 0.3s ease',
            transform: isActive ? 'translateY(-2px)' : 'none'
          })}
        >
          {item.icon}
          <span style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 500 }}>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
