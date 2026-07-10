import React, { useState, useEffect } from 'react';
import GameWrapper from './GameWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const ShadowNinja = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(null); // 'UP', 'DOWN', 'LEFT', 'RIGHT'
  const [timeLeft, setTimeLeft] = useState(100);
  const [level, setLevel] = useState(1);
  const [touchStart, setTouchStart] = useState(null);

  const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const decrease = 1.5 + (level * 0.5);
          if (prev - decrease <= 0) {
            setIsGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - decrease;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, level]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setIsGameOver(false);
    setIsPlaying(true);
    nextRound();
  };

  const nextRound = () => {
    setTimeLeft(100);
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    setDirection(randomDir);
  };

  const handleSwipe = (swipeDir) => {
    if (!isPlaying) return;
    
    if (swipeDir === direction) {
      // Correct swipe
      setScore(prev => prev + 15);
      setLevel(prev => prev + 0.1);
      nextRound();
    } else {
      // Wrong swipe
      setIsGameOver(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      switch(e.key) {
        case 'ArrowUp': handleSwipe('UP'); break;
        case 'ArrowDown': handleSwipe('DOWN'); break;
        case 'ArrowLeft': handleSwipe('LEFT'); break;
        case 'ArrowRight': handleSwipe('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, direction]);

  const handleTouchStart = (e) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) { // Threshold
        handleSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(dy) > 30) {
        handleSwipe(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    setTouchStart(null);
  };

  const getIcon = () => {
    switch(direction) {
      case 'UP': return <ArrowUp size={100} color="#ff3333" />;
      case 'DOWN': return <ArrowDown size={100} color="#ff3333" />;
      case 'LEFT': return <ArrowLeft size={100} color="#ff3333" />;
      case 'RIGHT': return <ArrowRight size={100} color="#ff3333" />;
      default: return null;
    }
  };

  return (
    <GameWrapper 
      gameId="shadowNinja" 
      title="Shadow Ninja" 
      score={score} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: '#ff3333' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>Ekranda ko'rsatilgan yo'nalishga qarab barmog'ingizni suring (svayp) yoki strelkalarni bosing!</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div 
          style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Timer Bar */}
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,51,51,0.2)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ 
              width: `${timeLeft}%`, 
              height: '100%', 
              background: '#ff3333',
              boxShadow: '0 0 10px #ff3333',
              transition: 'width 0.1s linear'
            }} />
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={direction}
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'rgba(255, 51, 51, 0.1)',
                  border: '2px solid #ff3333',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 0 30px rgba(255, 51, 51, 0.3)'
                }}
              >
                {getIcon()}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', paddingBottom: '30px' }}>
            Ekranda suring...
          </div>
        </div>
      )}
    </GameWrapper>
  );
};

export default ShadowNinja;
