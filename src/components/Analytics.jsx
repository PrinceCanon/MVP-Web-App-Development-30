import React from 'react';
import { motion } from 'framer-motion';
import { useTask } from '../contexts/TaskContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTarget, FiTrendingUp, FiClock, FiCheckCircle } = FiIcons;

const Analytics = () => {
  const { tasks } = useTask();

  const completedTasks = tasks.filter(task => task.completed);
  const activeTasks = tasks.filter(task => !task.completed);
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  );

  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
  };

  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <SafeIcon icon={icon} className="text-xl text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your productivity and task completion patterns
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={FiTarget}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={completedTasks.length}
          icon={FiCheckCircle}
          color="bg-green-500"
          subtitle={`${completionRate.toFixed(1)}% completion rate`}
        />
        <StatCard
          title="Active Tasks"
          value={activeTasks.length}
          icon={FiTrendingUp}
          color="bg-yellow-500"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks.length}
          icon={FiClock}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Priority Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(priorityStats).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <span className="capitalize text-gray-600 dark:text-gray-400">
                  {priority} Priority
                </span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    priority === 'high' ? 'bg-red-500' :
                    priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="capitalize text-gray-600 dark:text-gray-400">
                  {category}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Completions
          </h3>
          <div className="space-y-2">
            {completedTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <span className="text-gray-600 dark:text-gray-400">{task.title}</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {task.completedAt && new Date(task.completedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;