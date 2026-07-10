import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Zap, Target, Brain, Rocket, Palette, Move } from 'lucide-react';

const gamesList = [
  { id: 'neonRunner', name: 'Neon Runner', desc: 'Endless runner', icon: <Zap size={28} color="#fff" />, color: '#00f0ff', gradient: 'linear-gradient(135deg, rgba(0,240,255,0.4), rgba(0,100,255,0.1))' },
  { id: 'reflexMaster', name: 'Reflex Master', desc: 'Tezlik va reaksiya', icon: <Target size={28} color="#fff" />, color: '#b026ff', gradient: 'linear-gradient(135deg, rgba(176,38,255,0.4), rgba(80,0,255,0.1))' },
  { id: 'memoryClash', name: 'Memory Clash', desc: 'Xotira mashqi', icon: <Brain size={28} color="#fff" />, color: '#ffb347', gradient: 'linear-gradient(135deg, rgba(255,179,71,0.4), rgba(255,100,0,0.1))' },
  { id: 'spaceSurvivor', name: 'Space Survivor', desc: 'Fazo sarguzashti', icon: <Rocket size={28} color="#fff" />, color: '#ff007f', gradient: 'linear-gradient(135deg, rgba(255,0,127,0.4), rgba(150,0,50,0.1))' },
  { id: 'colorRush', name: 'Color Rush', desc: 'Ranglarni topish', icon: <Palette size={28} color="#fff" />, color: '#00ff66', gradient: 'linear-gradient(135deg, rgba(0,255,102,0.4), rgba(0,150,50,0.1))' },
  { id: 'shadowNinja', name: 'Shadow Ninja', desc: 'Svayp san\'ati', icon: <Move size={28} color="#fff" />, color: '#ff3333', gradient: 'linear-gradient(135deg, rgba(255,51,51,0.4), rgba(150,0,0,0.1))' }
];

const Games = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="page-transition"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} style={{ marginBottom: '25px', textAlign: 'center' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '5px' }}>Arena o'yinlari</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>O'zingizga yoqqan o'yinni tanlang</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
        {gamesList.map((game, index) => (
          <motion.div 
            key={game.id} 
            variants={itemVariants}
            whileHover={{ scale: 1.05, translateY: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/game/${game.id}`)}
            style={{ 
              background: game.gradient,
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              borderRadius: '20px',
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3)`,
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Glossy overlay */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: '50%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: `linear-gradient(135deg, ${game.color}, transparent)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '15px',
              boxShadow: `0 0 20px ${game.color}80`
            }}>
              {game.icon}
            </div>
            
            <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#fff', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{game.name}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', lineHeight: '1.2' }}>{game.desc}</p>
            
            <div style={{
              marginTop: '15px',
              width: '100%',
              padding: '8px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Play fill={game.color} color={game.color} size={14} />
              <span style={{ color: game.color, fontSize: '0.8rem', fontWeight: 'bold' }}>O'YNA</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Games;
