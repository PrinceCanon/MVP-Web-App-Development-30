import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTask } from '../contexts/TaskContext';
import TaskForm from './TaskForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiTag } = FiIcons;

const TaskItem = ({ task }) => {
  const { toggleTask, deleteTask } = useTask();
  const [showEditForm, setShowEditForm] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      personal: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      shopping: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      health: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[category] || colors.general;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 p-4 transition-all duration-200 hover:shadow-md ${
          task.completed
            ? 'border-green-500 opacity-75'
            : isOverdue
            ? 'border-red-500'
            : 'border-blue-500'
        }`}
      >
        <div className="flex items-start space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleTask(task.id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
            }`}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-white rounded-full"
              />
            )}
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-medium ${
                  task.completed
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditForm(true)}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <SafeIcon icon={FiEdit2} className="text-sm" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="text-sm" />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-3">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                <SafeIcon icon={FiFlag} className="text-xs" />
                <span className="capitalize">{task.priority}</span>
              </div>

              <div className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(task.category)}`}>
                <SafeIcon icon={FiTag} className="text-xs inline mr-1" />
                <span className="capitalize">{task.category}</span>
              </div>

              {task.dueDate && (
                <div className={`flex items-center space-x-1 text-xs ${
                  isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <SafeIcon icon={FiCalendar} className="text-xs" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {showEditForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="w-full max-w-md">
            <TaskForm
              editTask={task}
              onClose={() => setShowEditForm(false)}
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default TaskItem;