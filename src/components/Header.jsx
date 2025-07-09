import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheckSquare, FiSun, FiMoon, FiHome, FiBarChart3, FiSettings } = FiIcons;

const Header = ({ darkMode, setDarkMode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Tasks' },
    { path: '/analytics', icon: FiBarChart3, label: 'Analytics' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheckSquare} className="text-2xl text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <SafeIcon icon={darkMode ? FiSun : FiMoon} className="text-lg" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;