import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Show prompt unconditionally after 3 seconds for anyone not in standalone mode
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);

    // For Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // We already set it to show after 3s, but this ensures we have the prompt ready
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Agar beforeinstallprompt hali ishga tushmagan bo'lsa (yoki kompyuterda bo'lsa)
      alert("Ilovani o'rnatish uchun brauzer menyusidan 'Install' (yoki 'Add to Home Screen') tugmasini bosing.");
      setShowPrompt(false);
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, x: '-50%', opacity: 0 }}
          animate={{ y: '-50%', x: '-50%', opacity: 1 }}
          exit={{ y: 100, x: '-50%', opacity: 0 }}
          style={{
            position: 'fixed',
            top: '50%', // Show in center so it's very obvious
            left: '50%',
            width: '90%',
            maxWidth: '400px',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--neon-blue)',
            borderRadius: '20px',
            padding: '25px 20px',
            zIndex: 9999,
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(0,240,255,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <button 
            onClick={handleClose}
            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
          
          <div style={{ width: '70px', height: '70px', borderRadius: '18px', background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', boxShadow: '0 10px 20px rgba(176,38,255,0.4)' }}>
            <Download color="#fff" size={36} />
          </div>
          
          <h3 style={{ marginBottom: '10px', color: '#fff', fontSize: '1.5rem' }}>Ilovani o'rnating</h3>
          
          {isIOS ? (
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              Ilovani telefon ekraniga qo'shish uchun pastdagi qator markazidagi <Share size={18} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 5px' }} /> <b>Ulashish</b> tugmasini bosing va ro'yxatdan <b>"Add to Home Screen"</b> (Ekranga qo'shish) ni tanlang.
            </p>
          ) : (
            <>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.5' }}>
                Tezroq ishlashi va doim yoningizda bo'lishi uchun ilovani to'g'ridan-to'g'ri telefoningizga o'rnating!
              </p>
              <button className="glass-button" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} onClick={handleInstallClick}>
                O'rnatish
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
