import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Leaderboard = () => {
  const { userName, scores } = useGame();
  const userTotalPoints = Object.values(scores).reduce((acc, curr) => acc + curr.totalPoints, 0);

  // Mock data for leaderboard
  const mockPlayers = [
    { name: 'AlexThePro', points: 15420 },
    { name: 'NeonRider', points: 12350 },
    { name: 'ShadowKing', points: 10500 },
    { name: 'CyberGirl', points: 9800 },
    { name: userName, points: userTotalPoints, isUser: true },
    { name: 'SpeedsterX', points: 7200 },
    { name: 'Gamer99', points: 5100 },
  ].sort((a, b) => b.points - a.points); // Sort by points

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  const getRankColor = (index) => {
    if (index === 0) return '#ffd700'; // Gold
    if (index === 1) return '#c0c0c0'; // Silver
    if (index === 2) return '#cd7f32'; // Bronze
    return 'var(--text-secondary)';
  };

  return (
    <motion.div 
      className="page-transition"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Trophy color="var(--neon-blue)" size={48} style={{ margin: '0 auto 10px' }} />
        <h2 className="text-gradient" style={{ fontSize: '1.8rem' }}>Haftalik Reyting</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Eng yaxshi o'yinchilar ruyxati</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockPlayers.map((player, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            className="glass-panel"
            style={{ 
              padding: '15px 20px', 
              display: 'flex', 
              alignItems: 'center',
              background: player.isUser ? 'rgba(0, 240, 255, 0.15)' : 'var(--bg-card)',
              border: player.isUser ? '1px solid var(--neon-blue)' : '1px solid var(--glass-border)'
            }}
          >
            <div style={{ width: '30px', fontWeight: 'bold', color: getRankColor(index) }}>
              #{index + 1}
            </div>
            
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <h4 style={{ color: player.isUser ? 'var(--neon-blue)' : '#fff', fontSize: '1.1rem' }}>
                {player.name} {player.isUser && '(Siz)'}
              </h4>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {index < 3 && <Medal color={getRankColor(index)} size={16} />}
              <span style={{ fontWeight: 'bold', color: 'var(--neon-purple)' }}>{player.points}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;
