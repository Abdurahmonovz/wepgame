import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Trophy, Zap, Target, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { userName, scores } = useGame();
  const navigate = useNavigate();
  
  const totalPoints = Object.values(scores).reduce((acc, curr) => acc + curr.totalPoints, 0);
  const totalPlays = Object.values(scores).reduce((acc, curr) => acc + curr.plays, 0);
  
  const mockRank = 42; // Mock ranking

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
      <motion.div variants={itemVariants} style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Salom,</h2>
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>{userName}</h1>
        </div>
        <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '10px', borderRadius: '50%', border: '1px solid var(--neon-blue)' }}>
          <Trophy color="var(--neon-blue)" size={28} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '35px' }}>
        <div className="glass-panel" style={{ padding: '25px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, rgba(176,38,255,0.2), rgba(0,0,0,0.5))', border: '1px solid rgba(176,38,255,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '50px', height: '50px', background: 'var(--neon-purple)', filter: 'blur(30px)', opacity: 0.5 }}></div>
          <Star color="var(--neon-purple)" size={28} style={{ marginBottom: '12px' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', textShadow: '0 0 10px rgba(176,38,255,0.8)' }}>{totalPoints}</span>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>Umumiy ballar</span>
        </div>
        
        <div className="glass-panel" style={{ padding: '25px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(0,0,0,0.5))', border: '1px solid rgba(255,215,0,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '50px', height: '50px', background: '#ffd700', filter: 'blur(30px)', opacity: 0.5 }}></div>
          <Trophy color="#ffd700" size={28} style={{ marginBottom: '12px' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', textShadow: '0 0 10px rgba(255,215,0,0.8)' }}>#{mockRank}</span>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>Haftalik reyting</span>
        </div>
        
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,0,0,0.4))', border: '1px solid rgba(0,240,255,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(0,240,255,0.2)', padding: '12px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 15px rgba(0,240,255,0.4)' }}>
              <Target color="var(--neon-blue)" size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fff' }}>{totalPlays}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Jami o'ynalgan o'yinlar</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Kunlik vazifalar</h3>
        
        <div className="glass-panel" style={{ padding: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(176, 38, 255, 0.2)', padding: '10px', borderRadius: '10px' }}>
              <Zap color="var(--neon-purple)" size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>3 ta o'yin o'ynang</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--neon-blue)' }}>{Math.min(totalPlays, 3)} / 3 yakunlandi</p>
            </div>
          </div>
          <button 
            className="glass-button" 
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            onClick={() => navigate('/app/games')}
          >
            Bajarish
          </button>
        </div>
        
        <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(0, 255, 102, 0.2)', padding: '10px', borderRadius: '10px' }}>
              <Target color="var(--neon-green)" size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>500 ball yig'ing</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--neon-green)' }}>{Math.min(totalPoints, 500)} / 500 yakunlandi</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
