import React, { useState, useEffect, useRef } from 'react';
import GameWrapper from './GameWrapper';
import { Rocket } from 'lucide-react';

const SpaceSurvivor = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playerRef = useRef({ x: 50 });
  const [playerX, setPlayerX] = useState(50);
  const [asteroids, setAsteroids] = useState([]);
  
  const gameLoopRef = useRef();
  const speedRef = useRef(1);

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setAsteroids([]);
    playerRef.current = { x: 50 };
    setPlayerX(50);
    speedRef.current = 1;
    
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = () => {
    if (!isPlaying) return;

    setAsteroids(prev => {
      let currentAsteroids = prev.map(ast => ({
        ...ast,
        y: ast.y + (speedRef.current * 1.5)
      })).filter(ast => ast.y < 110);

      // Collision detection
      // Player is at playerRef.current.x (%), y is 80 (%)
      // Height is usually 2x width on mobile, so Y percentage should be smaller than X
      for (let ast of currentAsteroids) {
        if (
          Math.abs(ast.x - playerRef.current.x) < 5 && // 5% of screen width ~ 20px
          Math.abs(ast.y - 80) < 3 // 3% of screen height ~ 24px
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          return currentAsteroids;
        }
      }

      // Add new asteroid
      if (Math.random() < 0.05 + (speedRef.current * 0.01)) {
        currentAsteroids.push({
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5, // 5% to 95%
          y: -10,
          size: Math.random() * 20 + 20 // 20px to 40px
        });
      }

      return currentAsteroids;
    });

    setScore(prev => {
      const newScore = prev + 1;
      if (newScore % 500 === 0) speedRef.current += 0.2; // Increase speed over time
      return newScore;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [isPlaying, isGameOver]);

  const handleTouchMove = (e) => {
    if (!isPlaying) return;
    const touch = e.touches[0];
    const windowWidth = window.innerWidth;
    let newX = (touch.clientX / windowWidth) * 100;
    if (newX < 5) newX = 5;
    if (newX > 95) newX = 95;
    playerRef.current.x = newX;
    setPlayerX(newX);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') {
        playerRef.current.x = Math.max(5, playerRef.current.x - 5);
        setPlayerX(playerRef.current.x);
      } else if (e.key === 'ArrowRight') {
        playerRef.current.x = Math.min(95, playerRef.current.x + 5);
        setPlayerX(playerRef.current.x);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <GameWrapper 
      gameId="spaceSurvivor" 
      title="Space Survivor" 
      score={Math.floor(score / 10)} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--neon-pink)' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>Kemani boshqaring va asteroidlardan qoching. Barmog'ingiz bilan ekranda suring.</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div 
          style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
          onTouchMove={handleTouchMove}
        >
          {/* Asteroids */}
          {asteroids.map(ast => (
            <div
              key={ast.id}
              style={{
                position: 'absolute',
                left: `${ast.x}%`,
                top: `${ast.y}%`,
                width: `${ast.size}px`,
                height: `${ast.size}px`,
                background: 'var(--bg-card)',
                border: '1px solid var(--neon-pink)',
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(255, 0, 127, 0.5)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* Player Ship */}
          <div style={{
            position: 'absolute',
            left: `${playerX}%`,
            top: '80%',
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))'
          }}>
            <Rocket size={40} color="var(--neon-blue)" fill="var(--neon-blue)" style={{ transform: 'rotate(-45deg)' }} />
          </div>
        </div>
      )}
    </GameWrapper>
  );
};

export default SpaceSurvivor;
