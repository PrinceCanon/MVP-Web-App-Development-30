import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilters from './TaskFilters';
import { useTask } from '../contexts/TaskContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus } = FiIcons;

const TaskBoard = () => {
  const [showForm, setShowForm] = useState(false);
  const { tasks, getFilteredTasks } = useTask();

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Task Dashboard
                </h2>
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <span>{activeCount} active</span>
                  <span>{completedCount} completed</span>
                  <span>{tasks.length} total</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <SafeIcon icon={FiPlus} className="text-lg" />
                <span>Add Task</span>
              </motion.button>
            </div>

            <TaskFilters />
          </div>

          <TaskList tasks={filteredTasks} />
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="lg:w-96"
            >
              <TaskForm onClose={() => setShowForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskBoard;