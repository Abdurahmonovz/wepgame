import React, { createContext, useState, useEffect, useContext } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // High scores for each game
  const [scores, setScores] = useState({
    neonRunner: { best: 0, plays: 0, totalPoints: 0 },
    reflexMaster: { best: 0, plays: 0, totalPoints: 0 },
    memoryClash: { best: 0, plays: 0, totalPoints: 0 },
    spaceSurvivor: { best: 0, plays: 0, totalPoints: 0 },
    colorRush: { best: 0, plays: 0, totalPoints: 0 },
    shadowNinja: { best: 0, plays: 0, totalPoints: 0 },
    archeryHero: { best: 0, plays: 0, totalPoints: 0 },
    neonSnake: { best: 0, plays: 0, totalPoints: 0 },
  });

  const [achievements, setAchievements] = useState([]);

  // Load from local storage
  useEffect(() => {
    const storedData = localStorage.getItem('ultimateArenaData');
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.userName) setUserName(data.userName);
      if (data.hasSeenIntro) setHasSeenIntro(data.hasSeenIntro);
      if (data.scores) setScores(data.scores);
      if (data.achievements) setAchievements(data.achievements);
      if (data.soundEnabled !== undefined) setSoundEnabled(data.soundEnabled);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    const data = {
      userName,
      hasSeenIntro,
      scores,
      achievements,
      soundEnabled
    };
    localStorage.setItem('ultimateArenaData', JSON.stringify(data));
  }, [userName, hasSeenIntro, scores, achievements, soundEnabled]);

  const updateScore = (gameId, score) => {
    setScores(prev => {
      const newScores = { ...prev };
      const gameData = newScores[gameId];
      
      if (score > gameData.best) {
        gameData.best = score;
      }
      gameData.plays += 1;
      gameData.totalPoints += score;
      
      return newScores;
    });
    
    // Check achievements
    checkAchievements(gameId, score);
  };

  const checkAchievements = (gameId, score) => {
    const newAchievements = [...achievements];
    const totalPoints = Object.values(scores).reduce((acc, curr) => acc + curr.totalPoints, 0) + score;
    
    const award = (id, title) => {
      if (!newAchievements.find(a => a.id === id)) {
        newAchievements.push({ id, title, date: new Date().toISOString() });
        // TODO: Play achievement sound if enabled
      }
    };

    if (totalPoints >= 100) award('pts_100', '100 Points');
    if (totalPoints >= 500) award('pts_500', '500 Points');
    if (totalPoints >= 1000) award('pts_1000', '1000 Points');

    if (Object.values(scores).some(g => g.plays > 0) || score > 0) {
      award('first_win', 'First Win');
    }

    if (gameId === 'reflexMaster' && score > 300) award('reaction_king', 'Reaction King');
    if (gameId === 'memoryClash' && score > 200) award('memory_genius', 'Memory Genius');
    if (gameId === 'spaceSurvivor' && score > 500) award('space_legend', 'Space Legend');
    if (gameId === 'shadowNinja' && score > 400) award('shadow_ninja_master', 'Shadow Ninja Master');
    if (gameId === 'archeryHero' && score > 300) award('bullseye_master', 'Bullseye Master');
    if (gameId === 'neonSnake' && score > 500) award('snake_charmer', 'Snake Charmer');
    
    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <GameContext.Provider value={{
      userName, setUserName,
      hasSeenIntro, setHasSeenIntro,
      scores, updateScore,
      achievements,
      soundEnabled, toggleSound
    }}>
      {children}
    </GameContext.Provider>
  );
};
