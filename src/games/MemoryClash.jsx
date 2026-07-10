import React, { useState, useEffect } from 'react';
import GameWrapper from './GameWrapper';
import { motion } from 'framer-motion';
import { Zap, Star, Shield, Heart, Diamond, Hexagon, Circle, Triangle } from 'lucide-react';

const ICONS = [Zap, Star, Shield, Heart, Diamond, Hexagon, Circle, Triangle];

const MemoryClash = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setIsGameOver(false);
    setIsPlaying(true);
    initLevel(1);
  };

  const initLevel = (lvl) => {
    setFlipped([]);
    setMatched([]);
    
    // Determine grid size based on level
    let pairCount = 2 + Math.floor(lvl / 2);
    if (pairCount > 8) pairCount = 8; // Max 16 cards
    
    const levelIcons = ICONS.slice(0, pairCount);
    const deck = [...levelIcons, ...levelIcons]
      .sort(() => Math.random() - 0.5)
      .map((Icon, index) => ({ id: index, Icon }));
      
    setCards(deck);
    
    // Add extra time for level completion
    if (lvl > 1) {
      setTimeLeft(prev => prev + 15);
    }
  };

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      
      if (cards[first].Icon === cards[second].Icon) {
        setMatched(prev => [...prev, first, second]);
        setScore(prev => prev + 20);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Check level complete
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setScore(prev => prev + 50); // Level bonus
      setTimeout(() => {
        setLevel(prev => prev + 1);
        initLevel(level + 1);
      }, 1000);
    }
  }, [matched, cards]);

  return (
    <GameWrapper 
      gameId="memoryClash" 
      title="Memory Clash" 
      score={score} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: '#ffb347' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>Bir xil kartalarni toping. Vaqt tugamasidan oldin barcha kartalarni juftlang!</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ color: '#ffb347', fontWeight: 'bold' }}>Level: {level}</div>
            <div style={{ color: timeLeft <= 10 ? '#ff003c' : 'white', fontWeight: 'bold' }}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            display: 'grid', 
            gridTemplateColumns: cards.length > 12 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', 
            gap: '10px',
            alignContent: 'center'
          }}>
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index);
              const Icon = card.Icon;
              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    aspectRatio: '1/1',
                    background: isFlipped ? 'rgba(255, 179, 71, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isFlipped ? '#ffb347' : 'var(--glass-border)'}`,
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div style={{ 
                    opacity: isFlipped ? 1 : 0, 
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Icon size={32} color="#ffb347" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </GameWrapper>
  );
};

export default MemoryClash;
