import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import ParticleBackground from '../components/ParticleBackground';

const Onboarding = () => {
  const [nameInput, setNameInput] = useState('');
  const { setUserName } = useGame();

  const handleStart = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ParticleBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
        style={{ padding: '40px 20px', textAlign: 'center', width: '90%', maxWidth: '400px' }}
      >
        <motion.h1 
          className="text-gradient"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: '10px', fontSize: '2.5rem' }}
        >
          Xush kelibsiz!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}
        >
          Keling, avval siz bilan tanishib olaylik.
        </motion.p>
        
        <motion.form 
          onSubmit={handleStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--neon-blue)' }}>
              Ismingizni kiriting
            </label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Ism..." 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              required
              maxLength={15}
            />
          </div>
          
          <button 
            type="submit" 
            className="glass-button"
            disabled={!nameInput.trim()}
            style={{ opacity: nameInput.trim() ? 1 : 0.5, marginTop: '10px' }}
          >
            Boshlash
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
