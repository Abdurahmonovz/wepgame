import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ParticleBackground from '../components/ParticleBackground';

const messages = [
  "Ultimate Challenge Arena ga xush kelibsiz!",
  "Bu ilovada barcha rekordlaringiz saqlanadi.",
  "Har bir o'yinning eng yuqori natijasi Profil bo'limida yozib boriladi.",
  "Haftalik reytingda yuqori o'rinlarni egallagan foydalanuvchilar sovg'alar yutib olishlari mumkin.",
  "Omad tilaymiz!"
];

const Intro = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setHasSeenIntro } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentIndex < messages.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 3500); // Wait 3.5s per message
      return () => clearTimeout(timer);
    } else {
      handleComplete();
    }
  }, [currentIndex]);

  const handleComplete = () => {
    setHasSeenIntro(true);
    navigate('/app/home');
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ParticleBackground />
      
      <div style={{ position: 'relative', height: '150px', width: '90%', maxWidth: '500px', textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          {currentIndex < messages.length && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                width: '100%',
                top: 0,
                left: 0,
              }}
            >
              <h2 className="text-gradient" style={{ fontSize: '1.8rem', lineHeight: '1.4' }}>
                {messages[currentIndex]}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={handleComplete}
        className="glass-button"
        style={{
          position: 'absolute',
          bottom: '50px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'var(--text-secondary)'
        }}
      >
        O'tkazib yuborish
      </motion.button>
    </div>
  );
};

export default Intro;
