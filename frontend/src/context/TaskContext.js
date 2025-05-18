import React, { createContext, useState, useEffect } from 'react';
import { addTask as addTaskService, getTasks } from '../services/taskService';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const addTask = async (taskData) => {
    setLoading(true);
    try {
      await addTaskService(taskData);
      await fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, fetchTasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => React.useContext(TaskContext);