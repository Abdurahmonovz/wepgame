import React, { useState, useEffect } from 'react';
import GameWrapper from './GameWrapper';
import { motion } from 'framer-motion';

const colors = [
  { name: 'Qizil', hex: '#ff003c' },
  { name: 'Ko\'k', hex: '#00f0ff' },
  { name: 'Yashil', hex: '#00ff66' },
  { name: 'Sariq', hex: '#ffe600' },
  { name: 'Siyohrang', hex: '#b026ff' }
];

const ColorRush = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [currentColorName, setCurrentColorName] = useState(colors[0]);
  const [currentColorStyle, setCurrentColorStyle] = useState(colors[0]);
  
  const [timeLeft, setTimeLeft] = useState(100); // percentage for bar
  const [level, setLevel] = useState(1);

  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const decrease = 2 + (level * 0.5); // Faster decrease as level increases
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
    
    // Choose random word and random color
    const wordIndex = Math.floor(Math.random() * colors.length);
    let styleIndex = Math.floor(Math.random() * colors.length);
    
    // Make it more likely to match or trick (30% chance they match)
    if (Math.random() > 0.7) {
      styleIndex = wordIndex;
    }
    
    setCurrentColorName(colors[wordIndex]);
    setCurrentColorStyle(colors[styleIndex]);
  };

  const handleChoice = (hex) => {
    if (hex === currentColorStyle.hex) {
      // Correct!
      const points = 10 + Math.floor(timeLeft / 10);
      setScore(prev => prev + points);
      setLevel(prev => Math.min(10, prev + 0.2));
      nextRound();
    } else {
      // Wrong!
      setIsGameOver(true);
      setIsPlaying(false);
    }
  };

  return (
    <GameWrapper 
      gameId="colorRush" 
      title="Color Rush" 
      score={score} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--neon-green)' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>So'zning o'qilishiga emas, <b>RANGIGA</b> qarab to'g'ri tugmani bosing!</p>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff003c', marginBottom: '20px' }}>Ko'k</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>(Bu yerda "Qizil" tugmasini bosish kerak)</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
          
          {/* Timer Bar */}
          <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden', marginBottom: '40px' }}>
            <div style={{ 
              width: `${timeLeft}%`, 
              height: '100%', 
              background: timeLeft > 50 ? 'var(--neon-green)' : (timeLeft > 25 ? '#ffe600' : '#ff003c'),
              transition: 'width 0.1s linear, background 0.3s ease'
            }} />
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.h1 
              key={currentColorName.name + currentColorStyle.hex}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ 
                fontSize: '4rem', 
                fontWeight: 800, 
                color: currentColorStyle.hex,
                textShadow: `0 0 20px ${currentColorStyle.hex}80`
              }}
            >
              {currentColorName.name}
            </motion.h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', paddingBottom: '30px' }}>
            {colors.map(color => (
              <button
                key={color.name}
                onClick={() => handleChoice(color.hex)}
                className="glass-button"
                style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${color.hex}`,
                  color: color.hex,
                  textShadow: 'none',
                  padding: '20px',
                  fontSize: '1.2rem'
                }}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </GameWrapper>
  );
};

export default ColorRush;
