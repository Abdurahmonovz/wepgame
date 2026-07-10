import React, { useState, useEffect, useRef } from 'react';
import GameWrapper from './GameWrapper';

const NeonRunner = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [isJumping, setIsJumping] = useState(false);
  const playerY = useRef(0);
  
  const [obstacles, setObstacles] = useState([]);
  const gameLoopRef = useRef();
  const speedRef = useRef(1);

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setObstacles([]);
    setIsJumping(false);
    playerY.current = 0;
    speedRef.current = 1;
    
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const jump = () => {
    if (!isJumping && isPlaying) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 500); // Jump duration
    }
  };

  const gameLoop = () => {
    if (!isPlaying) return;

    setObstacles(prev => {
      let currentObstacles = prev.map(obs => ({
        ...obs,
        x: obs.x - (speedRef.current * 1.5)
      })).filter(obs => obs.x > -10);

      // Collision detection
      // Player is fixed at x=20%, width 30px, height 30px.
      // Jump height sets Y to bottom 50px (simulated via isJumping state)
      const isCurrentlyJumping = isJumping;
      
      for (let obs of currentObstacles) {
        if (obs.x > 15 && obs.x < 25) { // X bounds approximate
          if (!isCurrentlyJumping) { // Y bounds, obstacle is on ground
            setIsGameOver(true);
            setIsPlaying(false);
            return currentObstacles;
          }
        }
      }

      // Add new obstacle
      if (currentObstacles.length === 0 || currentObstacles[currentObstacles.length - 1].x < 50) {
        if (Math.random() < 0.02) { // spawn rate
          currentObstacles.push({
            id: Date.now(),
            x: 100,
            width: 20 + Math.random() * 20,
            height: 30 + Math.random() * 30
          });
        }
      }

      return currentObstacles;
    });

    setScore(prev => {
      const newScore = prev + 1;
      if (newScore % 500 === 0) speedRef.current += 0.2; // Increase speed
      return newScore;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [isPlaying, isGameOver, isJumping]); // Added isJumping dependency so loop knows jump state

  return (
    <GameWrapper 
      gameId="neonRunner" 
      title="Neon Runner" 
      score={Math.floor(score / 10)} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--neon-blue)' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>To'siqlardan sakrab o'ting. Sakrash uchun ekranga bosing.</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div 
          onClick={jump}
          style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
        >
          {/* Ground */}
          <div style={{ position: 'absolute', bottom: '20%', width: '100%', height: '2px', background: 'var(--neon-blue)', boxShadow: '0 0 10px var(--neon-blue)' }} />

          {/* Player */}
          <div style={{
            position: 'absolute',
            left: '20%',
            bottom: isJumping ? 'calc(20% + 80px)' : '20%',
            width: '30px',
            height: '40px',
            background: 'var(--neon-blue)',
            boxShadow: '0 0 15px var(--neon-blue)',
            transition: 'bottom 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: 'translateX(-50%)',
            borderRadius: '4px'
          }} />

          {/* Obstacles */}
          {obstacles.map(obs => (
            <div
              key={obs.id}
              style={{
                position: 'absolute',
                left: `${obs.x}%`,
                bottom: '20%',
                width: `${obs.width}px`,
                height: `${obs.height}px`,
                background: 'transparent',
                border: '2px solid var(--neon-purple)',
                boxShadow: '0 0 10px var(--neon-purple)',
                transform: 'translateX(-50%)'
              }}
            />
          ))}
        </div>
      )}
    </GameWrapper>
  );
};

export default NeonRunner;
