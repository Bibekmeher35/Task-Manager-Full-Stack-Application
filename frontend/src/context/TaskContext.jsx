import { createContext, useState, useCallback } from 'react';
import API from '../api/axios';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sort: 'newest',
  });

  // Fetch all tasks with current filters
  const fetchTasks = useCallback(async (filterOverrides) => {
    setLoading(true);
    try {
      const params = { ...filters, ...filterOverrides };
      const res = await API.get('/tasks', { params });
      setTasks(res.data.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get('/tasks/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Create task
  const createTask = useCallback(async (taskData) => {
    const res = await API.post('/tasks', taskData);
    setTasks((prev) => [res.data.data, ...prev]);
    return res.data;
  }, []);

  // Update task
  const updateTask = useCallback(async (id, taskData) => {
    const res = await API.put(`/tasks/${id}`, taskData);
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? res.data.data : task))
    );
    return res.data;
  }, []);

  // Delete task
  const deleteTask = useCallback(async (id) => {
    await API.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((task) => task._id !== id));
  }, []);

  // Toggle task completion
  const toggleTask = useCallback(async (id) => {
    const res = await API.patch(`/tasks/${id}/toggle`);
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? res.data.data : task))
    );
    return res.data;
  }, []);

  // Delete all completed tasks
  const deleteCompletedTasks = useCallback(async () => {
    const res = await API.delete('/tasks/completed/all');
    setTasks((prev) => prev.filter((task) => !task.completed));
    return res.data;
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        filters,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        deleteTask,
        toggleTask,
        deleteCompletedTasks,
        updateFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
