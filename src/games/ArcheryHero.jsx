import React, { useState, useEffect, useRef } from 'react';
import GameWrapper from './GameWrapper';
import { Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArcheryHero = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arrowsLeft, setArrowsLeft] = useState(10);
  
  const [targetY, setTargetY] = useState(50);
  const [targetDirection, setTargetDirection] = useState(1); // 1 is down, -1 is up
  const [targetSpeed, setTargetSpeed] = useState(2);
  
  const [arrow, setArrow] = useState(null); // null or { x, y }
  
  const gameLoopRef = useRef(null);
  const containerRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setArrowsLeft(10);
    setIsGameOver(false);
    setIsPlaying(true);
    setTargetY(50);
    setTargetSpeed(2);
    setArrow(null);
    
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(gameLoop, 30);
  };

  const gameLoop = () => {
    // Move Target
    setTargetY(prev => {
      let newY = prev + (targetDirection * targetSpeed);
      if (newY > 90) {
        setTargetDirection(-1);
        newY = 90;
      } else if (newY < 10) {
        setTargetDirection(1);
        newY = 10;
      }
      return newY;
    });

    // Move Arrow
    setArrow(prev => {
      if (!prev) return null;
      const newX = prev.x + 4; // Arrow speed slower to be visible
      
      // Collision detection when arrow reaches the right side (where target is)
      if (newX >= 85 && newX <= 95) {
        // Target is at x ~ 90, y is targetY
        // Target height is about 15% 
        const dist = Math.abs(prev.y - targetY);
        if (dist < 15) {
          // Hit!
          let points = 10;
          if (dist < 3) points = 50; // Bullseye
          else if (dist < 8) points = 30; // Close

          setScore(s => {
            const newScore = s + points;
            if (newScore % 50 === 0 || newScore % 50 < points) setTargetSpeed(ts => ts + 0.5);
            return newScore;
          });
          return null; // Remove arrow
        }
      }
      
      // Missed
      if (newX > 100) {
        setArrowsLeft(a => {
          const newArrows = a - 1;
          if (newArrows <= 0) {
            setIsGameOver(true);
            setIsPlaying(false);
            clearInterval(gameLoopRef.current);
          }
          return newArrows;
        });
        return null; // Remove arrow
      }
      
      return { ...prev, x: newX };
    });
  };

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = setInterval(gameLoop, 30);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying, isGameOver, targetDirection, targetSpeed, targetY]);

  const handleShoot = () => {
    if (!isPlaying || arrow) return; // Only one arrow at a time
    // Shoot from the middle left
    setArrow({ x: 10, y: 50 });
  };

  return (
    <GameWrapper 
      gameId="archeryHero" 
      title="Archery Hero" 
      score={score} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: '#ffd700' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>Harakatlanayotgan nishonga o'q uzing. O'q otish uchun ekranga bosing. Sizda jami 10 ta o'q bor (agar xato qilsangiz kamayadi).</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div 
          ref={containerRef}
          onClick={handleShoot}
          style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
        >
          {/* HUD */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', zIndex: 5, pointerEvents: 'none' }}>
            <div style={{ color: '#ffd700', fontWeight: 'bold' }}>Qolgan o'q: {arrowsLeft}</div>
          </div>

          {/* Bow / Shooter */}
          <div style={{
            position: 'absolute',
            left: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '100px',
            borderRight: '4px solid #fff',
            borderTop: '2px solid transparent',
            borderBottom: '2px solid transparent',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '2px 0 10px rgba(255, 215, 0, 0.5)'
          }}>
            <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.3)', position: 'absolute' }} />
          </div>

          {/* Arrow */}
          {arrow && (
            <div style={{
              position: 'absolute',
              left: `${arrow.x}%`,
              top: `${arrow.y}%`,
              transform: 'translateY(-50%)',
              width: '50px',
              height: '8px',
              background: '#00ff66',
              boxShadow: '0 0 15px #00ff66',
              borderRadius: '4px',
              zIndex: 10
            }}>
              <div style={{
                position: 'absolute',
                right: '-8px',
                top: '-6px',
                borderLeft: '16px solid #00ff66',
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
              }} />
            </div>
          )}

          {/* Target */}
          <div style={{
            position: 'absolute',
            left: '90%',
            top: `${targetY}%`,
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '60px',
            background: 'linear-gradient(to bottom, #ff3333 0%, #fff 50%, #ff3333 100%)',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(255, 51, 51, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '20px', background: 'var(--neon-yellow)', borderRadius: '4px' }} />
          </div>
        </div>
      )}
    </GameWrapper>
  );
};

export default ArcheryHero;
