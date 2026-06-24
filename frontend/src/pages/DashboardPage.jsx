import { useState, useEffect } from 'react';
import { TaskProvider } from '../context/TaskContext';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/layout/Navbar';
import TaskStats from '../components/tasks/TaskStats';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const DashboardContent = () => {
  const { fetchTasks, fetchStats, deleteCompletedTasks, stats } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleDeleteCompleted = async () => {
    if (stats.completed === 0) {
      toast('No completed tasks to delete', { icon: 'ℹ️' });
      return;
    }
    try {
      const res = await deleteCompletedTasks();
      fetchStats();
      toast.success(res.message);
    } catch {
      toast.error('Failed to delete completed tasks');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Stats */}
        <TaskStats />

        {/* Toolbar + Filters */}
        <TaskFilters />

        {/* Task list header */}
        <div className="task-list-header">
          <h2>Your Tasks</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-danger"
              onClick={handleDeleteCompleted}
              title="Delete all completed tasks"
              id="delete-completed-btn"
              style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
            >
              <HiOutlineTrash /> Clear Done
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setIsFormOpen(true)}
              id="add-task-btn"
              style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
            >
              <HiOutlinePlus /> New Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <TaskList onEditTask={handleEditTask} />

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          editingTask={editingTask}
        />
      </div>
    </>
  );
};

// Wrap with TaskProvider
const DashboardPage = () => {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
};

export default DashboardPage;
