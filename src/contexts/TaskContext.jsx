import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  filter: 'all',
  searchQuery: '',
  sortBy: 'created'
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : null }
            : task
        )
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      dispatch({ type: 'LOAD_TASKS', payload: JSON.parse(savedTasks) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  const addTask = (task) => {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        ...task,
        created: new Date(),
        completed: false,
        priority: task.priority || 'medium'
      }
    });
  };

  const updateTask = (task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTask = (id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSearch = (query) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  };

  const setSort = (sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };

  const getFilteredTasks = () => {
    let filtered = state.tasks;

    if (state.filter !== 'all') {
      filtered = filtered.filter(task => {
        switch (state.filter) {
          case 'active':
            return !task.completed;
          case 'completed':
            return task.completed;
          case 'high':
            return task.priority === 'high';
          case 'medium':
            return task.priority === 'medium';
          case 'low':
            return task.priority === 'low';
          default:
            return true;
        }
      });
    }

    if (state.searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'created':
        default:
          return new Date(b.created) - new Date(a.created);
      }
    });

    return filtered;
  };

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
    setSearch,
    setSort,
    getFilteredTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};