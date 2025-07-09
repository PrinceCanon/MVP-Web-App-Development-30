import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { TaskProvider } from './contexts/TaskContext';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <TaskProvider>
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${
          darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
        }`}>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/" element={<TaskBoard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </motion.main>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;