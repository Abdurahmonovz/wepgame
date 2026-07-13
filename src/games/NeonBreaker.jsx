import React, { useState, useEffect, useRef } from 'react';
import GameWrapper from './GameWrapper';

const NeonBreaker = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const paddleWidth = 80;
  const paddleHeight = 10;
  const ballSize = 10;
  const brickRowCount = 5;
  const brickColCount = 6;
  const brickHeight = 20;
  
  const paddleRef = useRef(150); 
  const ballRef = useRef({ x: 150, y: 300, vx: 3, vy: -3 });
  const bricksRef = useRef([]); 
  const gameLoopRef = useRef(null);
  const containerRef = useRef(null);
  const containerSize = useRef({ w: 300, h: 500 });
  
  const [renderPaddle, setRenderPaddle] = useState(150);
  const [renderBall, setRenderBall] = useState({ x: 150, y: 300 });
  const [renderBricks, setRenderBricks] = useState([]);
  
  const colors = ['#ff007f', '#00f0ff', '#00ff66', '#b026ff', '#ffd700']; // neon pink, blue, green, purple, yellow

  const generateBricks = (cw) => {
    const newBricks = [];
    const brickWidth = (cw - 20) / brickColCount; 
    for (let c = 0; c < brickColCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        newBricks.push({
          id: `${r}-${c}`,
          x: 10 + c * brickWidth,
          y: 40 + r * (brickHeight + 10),
          w: brickWidth - 6,
          h: brickHeight,
          status: 1,
          color: colors[r % colors.length]
        });
      }
    }
    return newBricks;
  };

  const initGame = () => {
    let cw = 300;
    let ch = 500;
    if (containerRef.current) {
      cw = containerRef.current.clientWidth;
      ch = containerRef.current.clientHeight;
      containerSize.current = { w: cw, h: ch };
    }
    
    paddleRef.current = cw / 2;
    ballRef.current = { x: cw / 2, y: ch - 80, vx: 4 * (Math.random() > 0.5 ? 1 : -1), vy: -5 };
    
    const newBricks = generateBricks(cw);
    bricksRef.current = newBricks;
    setRenderBricks(newBricks);
    setRenderPaddle(paddleRef.current);
    setRenderBall(ballRef.current);
  };

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    // setTimeout to allow container to mount and get sizes
    setTimeout(() => {
      initGame();
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      gameLoopRef.current = setInterval(gameLoop, 1000 / 60);
    }, 100);
  };

  const gameLoop = () => {
    const cw = containerSize.current.w;
    const ch = containerSize.current.h;
    const b = ballRef.current;
    
    // Move ball
    b.x += b.vx;
    b.y += b.vy;
    
    // Wall collisions
    if (b.x - ballSize / 2 <= 0) { b.vx = -b.vx; b.x = ballSize / 2; }
    if (b.x + ballSize / 2 >= cw) { b.vx = -b.vx; b.x = cw - ballSize / 2; }
    if (b.y - ballSize / 2 <= 0) { b.vy = -b.vy; b.y = ballSize / 2; }
    
    // Bottom collision (Game Over)
    if (b.y + ballSize / 2 >= ch) {
      setIsGameOver(true);
      setIsPlaying(false);
      clearInterval(gameLoopRef.current);
      return;
    }
    
    // Paddle collision
    const paddleTop = ch - 40 - paddleHeight;
    const paddleBottom = ch - 40;
    const paddleLeft = paddleRef.current - paddleWidth / 2;
    const paddleRight = paddleRef.current + paddleWidth / 2;
    
    if (
      b.y + ballSize / 2 >= paddleTop &&
      b.y - ballSize / 2 <= paddleBottom &&
      b.x >= paddleLeft &&
      b.x <= paddleRight
    ) {
      b.vy = -Math.abs(b.vy);
      // Add english based on where it hit paddle
      const hitPoint = b.x - paddleRef.current;
      b.vx = hitPoint * 0.15; // adjust angle
      
      // Speed up slightly
      if (Math.abs(b.vy) < 10) b.vy *= 1.02;
    }
    
    // Brick collision
    let hit = false;
    let newScore = 0;
    
    const activeBricks = bricksRef.current.filter(br => br.status === 1);
    
    for (let br of activeBricks) {
      if (
        b.x + ballSize / 2 > br.x &&
        b.x - ballSize / 2 < br.x + br.w &&
        b.y + ballSize / 2 > br.y &&
        b.y - ballSize / 2 < br.y + br.h
      ) {
        br.status = 0;
        b.vy = -b.vy; // Simple bounce
        hit = true;
        newScore += 10;
        break; // Only hit one brick per frame
      }
    }
    
    if (hit) {
      setScore(s => s + newScore);
    }
    
    // Check win condition (all bricks gone) -> Generate next level
    if (activeBricks.length === 0 && bricksRef.current.length > 0) {
      b.vy = Math.abs(b.vy) + 1; // Faster next level
      b.vx = b.vx > 0 ? Math.abs(b.vx) + 0.5 : -Math.abs(b.vx) - 0.5;
      bricksRef.current = generateBricks(cw);
    }
    
    setRenderBall({ ...b });
    setRenderPaddle(paddleRef.current);
    if (hit || activeBricks.length === 0) {
      setRenderBricks([...bricksRef.current]);
    }
  };

  // Paddle controls
  const handleMouseMove = (e) => {
    if (!isPlaying || isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cw = containerSize.current.w;
    paddleRef.current = Math.max(paddleWidth / 2, Math.min(x, cw - paddleWidth / 2));
  };
  
  const handleTouchMove = (e) => {
    if (!isPlaying || isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const cw = containerSize.current.w;
    paddleRef.current = Math.max(paddleWidth / 2, Math.min(x, cw - paddleWidth / 2));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying || isGameOver) return;
      const cw = containerSize.current.w;
      if (e.key === 'ArrowLeft') {
        paddleRef.current = Math.max(paddleWidth / 2, paddleRef.current - 30);
      } else if (e.key === 'ArrowRight') {
        paddleRef.current = Math.min(cw - paddleWidth / 2, paddleRef.current + 30);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  return (
    <GameWrapper 
      gameId="neonBreaker" 
      title="Neon Breaker" 
      score={score} 
      isGameOver={isGameOver}
      onRestart={startGame}
    >
      {!isPlaying && !isGameOver ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', color: '#00ffff' }}>Qoidalar</h3>
          <p style={{ marginBottom: '30px' }}>Pastdagi doskani ekranga bosib harakatlantiring. To'p orqali tepadagi g'ishtlarni sindirib ball to'plang!</p>
          <button className="glass-button" onClick={startGame}>O'yinni Boshlash</button>
        </div>
      ) : (
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', cursor: 'none' }}
        >
          {/* Bricks */}
          {renderBricks.map((br) => br.status === 1 && (
            <div key={br.id} style={{
              position: 'absolute',
              left: br.x,
              top: br.y,
              width: br.w,
              height: br.h,
              background: br.color,
              boxShadow: `0 0 10px ${br.color}`,
              borderRadius: '2px'
            }} />
          ))}
          
          {/* Paddle */}
          <div style={{
            position: 'absolute',
            left: renderPaddle - paddleWidth / 2,
            bottom: '40px',
            width: paddleWidth,
            height: paddleHeight,
            background: 'var(--neon-blue)',
            boxShadow: '0 0 15px var(--neon-blue)',
            borderRadius: '5px'
          }} />
          
          {/* Ball */}
          <div style={{
            position: 'absolute',
            left: renderBall.x - ballSize / 2,
            top: renderBall.y - ballSize / 2,
            width: ballSize,
            height: ballSize,
            background: '#fff',
            borderRadius: '50%',
            boxShadow: '0 0 15px #fff'
          }} />
        </div>
      )}
    </GameWrapper>
  );
};

export default NeonBreaker;
