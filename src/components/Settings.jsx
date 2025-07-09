import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTask } from '../contexts/TaskContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiUpload, FiTrash2, FiAlertTriangle } = FiIcons;

const Settings = () => {
  const { tasks, addTask } = useTask();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTasks = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target.result);
          if (Array.isArray(importedTasks)) {
            importedTasks.forEach(task => {
              addTask({
                ...task,
                id: undefined // Let the system generate new IDs
              });
            });
            alert('Tasks imported successfully!');
          }
        } catch (error) {
          alert('Error importing tasks. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllTasks = () => {
    localStorage.removeItem('tasks');
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your task data and preferences
        </p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Management
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Export Tasks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download all your tasks as a JSON file
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportTasks}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiDownload} />
                <span>Export</span>
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Import Tasks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Import tasks from a JSON file
                </p>
              </div>
              <label className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                <SafeIcon icon={FiUpload} />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importTasks}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Storage Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Tasks:</span>
              <span className="font-medium text-gray-900 dark:text-white">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completed:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {tasks.filter(task => task.completed).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {tasks.filter(task => !task.completed).length}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4 flex items-center">
            <SafeIcon icon={FiAlertTriangle} className="mr-2" />
            Danger Zone
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-400">Clear All Tasks</h4>
              <p className="text-sm text-red-600 dark:text-red-500">
                This will permanently delete all your tasks. This action cannot be undone.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiTrash2} />
              <span>Clear All</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete all tasks? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={clearAllTasks}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;