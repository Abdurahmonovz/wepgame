import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';

const GameWrapper = ({ children, gameId, title, score, isGameOver, onRestart }) => {
  const navigate = useNavigate();
  const { scores, updateScore, soundEnabled } = useGame();
  
  useEffect(() => {
    if (isGameOver) {
      updateScore(gameId, score);
      if (soundEnabled) {
        // play game over sound
      }
    }
  }, [isGameOver]);

  const bestScore = scores[gameId]?.best || 0;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-dark)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <button 
          onClick={() => navigate('/app/games')}
          style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
        >
          <ArrowLeft size={24} /> Orqaga
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }} className="text-gradient">{title}</h2>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Eng yaxshi: {bestScore}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--neon-blue)' }}>{score}</div>
        </div>
      </div>

      {/* Game Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
          {children}
        </div>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(10, 11, 16, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20
        }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '10px' }}>O'YIN TUGADI</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Sizning ballingiz: <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>{score}</span></p>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="glass-button" onClick={onRestart}>
              Qayta o'ynash
            </button>
            <button className="glass-button" style={{ background: 'transparent' }} onClick={() => navigate('/app/games')}>
              Chiqish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameWrapper;
