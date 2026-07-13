import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { User, Award, Volume2, VolumeX } from 'lucide-react';

const gameNames = {
  neonRunner: 'Neon Runner',
  reflexMaster: 'Reflex Master',
  memoryClash: 'Memory Clash',
  spaceSurvivor: 'Space Survivor',
  colorRush: 'Color Rush',
  shadowNinja: 'Shadow Ninja',
  archeryHero: 'Archery Hero',
  neonSnake: 'Neon Snake'
};

const Profile = () => {
  const { userName, scores, achievements, soundEnabled, toggleSound } = useGame();

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
      <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '20px', textAlign: 'center', marginBottom: '25px', position: 'relative' }}>
        <button 
          onClick={toggleSound}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          {soundEnabled ? <Volume2 size={24} color="var(--neon-blue)" /> : <VolumeX size={24} />}
        </button>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px' }}>
          <User size={40} color="#fff" />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{userName}</h2>
        <p style={{ color: 'var(--neon-blue)' }}>Ultimate O'yinchi</p>
      </motion.div>

      <motion.div variants={itemVariants} style={{ marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award color="var(--neon-purple)" /> 
          <span>Yutuqlar ({achievements.length})</span>
        </h3>
        
        {achievements.length === 0 ? (
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Hali yutuqlar yo'q. O'ynashni boshlang!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
            {achievements.map((ach) => (
              <div key={ach.id} className="glass-panel" style={{ padding: '15px 10px', textAlign: 'center', border: '1px solid var(--neon-purple)' }}>
                <Award size={24} color="var(--neon-pink)" style={{ marginBottom: '5px' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{ach.title}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 style={{ marginBottom: '15px' }}>O'yinlar Statistikasi</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {Object.entries(scores).map(([gameId, stat]) => (
            <div key={gameId} className="glass-panel" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '5px' }}>{gameNames[gameId]}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  O'ynaldi: {stat.plays} marta | Ballar: {stat.totalPoints}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Eng yaxshi natija</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--neon-blue)' }}>{stat.best}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
