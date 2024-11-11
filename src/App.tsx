import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUserStore } from './store/userStore';
import { Register } from './components/Register';
import { Phone } from './components/Phone';
import { SignIn } from './components/SignIn';
import { PublicProfile } from './components/PublicProfile';
import { CreateProfile } from './components/CreateProfile';
import { About } from './components/About';
import { useState, useEffect } from 'react';

function AppContent() {
  const { isLoggedIn, needsProfile, initializeAuthState } = useUserStore();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    initializeAuthState();
  }, [initializeAuthState]);

  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/:userId" element={<PublicProfile />} />
      <Route path="/" element={
        isLoggedIn ? (
          needsProfile ? (
            <CreateProfile />
          ) : (
            <Phone />
          )
        ) : showRegister ? (
          <Register onBack={() => setShowRegister(false)} />
        ) : (
          <SignIn onRegister={() => setShowRegister(true)} />
        )
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}