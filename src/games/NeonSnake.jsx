import React, { useState, useEffect, useRef } from 'react';
import GameWrapper from './GameWrapper';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

const NeonSnake = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  
  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const gameLoopRef = useRef(null);
  
  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Make sure food is not on snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  };

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    snakeRef.current = initialSnake;
    
    const initialDir = { x: 0, y: -1 };
    setDirection(initialDir);
    directionRef.current = initialDir;
    
    const initialFood = generateFood(initialSnake);
    setFood(initialFood);
    foodRef.current = initialFood;
    setIsPlaying(true);
  };

  const handleTouch = (dir) => {
    if (!isPlaying) return;
    const currentDir = directionRef.current;
    
    if (dir === 'UP' && currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
    if (dir === 'DOWN' && currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
    if (dir === 'LEFT' && currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
    if (dir === 'RIGHT' && currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
    
    setDirection(directionRef.current);
  };

  const touchStartRef = useRef(null);
  
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || !isPlaying) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartRef.current.x;
    const diffY = endY - touchStartRef.current.y;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 30) handleTouch(diffX > 0 ? 'RIGHT' : 'LEFT');
    } else {
      if (Math.abs(diffY) > 30) handleTouch(diffY > 0 ? 'DOWN' : 'UP');
    }
    touchStartRef.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      const currentDir = directionRef.current;
      
      if (e.key === 'ArrowUp' && currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
      
      setDirection(directionRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = setInterval(() => {
        const currentSnake = [...snakeRef.current];
        const head = { ...currentSnake[0] };
        const dir = directionRef.current;
        
        head.x += dir.x;
        head.y += dir.y;
        
        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsPlaying(false);
          return;
        }
        
        // Self collision
        if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          return;
        }
        
        currentSnake.unshift(head);
        
        // Food check synchronously
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          setScore(s => s + 10);
          const newFood = generateFood(currentSnake);
          setFood(newFood);
          foodRef.current = newFood;
        } else {
          currentSnake.pop();
        }
        
        snakeRef.current = currentSnake;
        setSnake(currentSnake);
        
      }, Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10));
    }
    
    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying, isGameOver, score]);

  return (
    <GameWrapper 
      gameId="neonSnake" 
      title="Neon Snake" 
      score={score} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--neon-green)' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>Ilonchani boshqarib oziqlantiring. Devorga yoki o'zingizga urilmang. Boshqarish uchun tugmalardan yoki klaviaturadan foydalaning.</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', width: '100%' }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div 
            style={{ 
              width: '90vw', 
              maxWidth: '350px',
              height: '90vw',
              maxHeight: '350px',
              background: 'var(--bg-card)', 
              border: '2px solid #39ff14',
              borderRadius: '10px',
              position: 'relative',
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.3)',
              marginBottom: '20px'
            }}
          >
            {/* Snake */}
            {snake.map((segment, index) => (
              <div 
                key={index}
                style={{
                  position: 'absolute',
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  background: index === 0 ? '#fff' : '#39ff14',
                  boxShadow: index === 0 ? '0 0 10px #fff' : '0 0 8px #39ff14',
                  borderRadius: index === 0 ? '4px' : '2px',
                  border: '1px solid rgba(0,0,0,0.3)'
                }}
              />
            ))}
            
            {/* Food */}
            <div 
              style={{
                position: 'absolute',
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                background: '#ff007f',
                borderRadius: '50%',
                boxShadow: '0 0 15px #ff007f'
              }}
            />
          </div>
          
          {/* Controls for mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '200px' }}>
            <div />
            <button className="glass-button" style={{ padding: '15px' }} onClick={() => handleTouch('UP')}><ArrowUp size={24} /></button>
            <div />
            <button className="glass-button" style={{ padding: '15px' }} onClick={() => handleTouch('LEFT')}><ArrowLeft size={24} /></button>
            <button className="glass-button" style={{ padding: '15px' }} onClick={() => handleTouch('DOWN')}><ArrowDown size={24} /></button>
            <button className="glass-button" style={{ padding: '15px' }} onClick={() => handleTouch('RIGHT')}><ArrowRight size={24} /></button>
          </div>
        </div>
      )}
    </GameWrapper>
  );
};

export default NeonSnake;
