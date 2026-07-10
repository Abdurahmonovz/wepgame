import React, { useState, useEffect, useRef } from 'react';
import GameWrapper from './GameWrapper';
import { motion, AnimatePresence } from 'framer-motion';

const ReflexMaster = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [target, setTarget] = useState(null);
  const [combo, setCombo] = useState(0);
  
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  
  const [timeLeft, setTimeLeft] = useState(30);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsPlaying(true);
    spawnTarget();
  };

  const spawnTarget = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const size = Math.max(40, 80 - combo * 2); // gets smaller as combo increases
      const x = Math.random() * (width - size);
      const y = Math.random() * (height - size);
      
      setTarget({ id: Date.now(), x, y, size });
      
      // Auto fail if target not clicked in time (gets faster)
      const duration = Math.max(500, 2000 - combo * 100);
      
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCombo(0);
        spawnTarget();
      }, duration);
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0 && isPlaying) {
      setIsGameOver(true);
      setIsPlaying(false);
      clearTimeout(timerRef.current);
    }
  }, [isPlaying, timeLeft]);

  const handleTargetClick = (e) => {
    e.stopPropagation();
    const newCombo = combo + 1;
    const points = 10 + Math.floor(newCombo / 5) * 5; // Multiplier
    
    setScore(prev => prev + points);
    setCombo(newCombo);
    spawnTarget();
  };

  const handleMissClick = () => {
    if (isPlaying) {
      setCombo(0);
    }
  };

  return (
    <GameWrapper 
      gameId="reflexMaster" 
      title="Reflex Master" 
      score={score} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--neon-purple)' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>Paydo bo'lgan nishonlarni iloji boricha tezroq bosing. Ketma-ket topsangiz, ko'proq ball olasiz!</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div 
          ref={containerRef}
          onClick={handleMissClick}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {/* HUD */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', zIndex: 5, pointerEvents: 'none' }}>
            <div style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>Combo: x{Math.floor(combo/5) + 1}</div>
            <div style={{ color: timeLeft <= 5 ? 'var(--neon-pink)' : 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>

          <AnimatePresence>
            {target && isPlaying && (
              <motion.div
                key={target.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={handleTargetClick}
                style={{
                  position: 'absolute',
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--neon-purple) 0%, transparent 80%)',
                  border: '2px solid var(--neon-purple)',
                  boxShadow: '0 0 15px var(--neon-purple)',
                  cursor: 'crosshair',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div style={{ width: '30%', height: '30%', background: 'white', borderRadius: '50%' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </GameWrapper>
  );
};

export default ReflexMaster;
