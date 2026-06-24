import { useTasks } from '../../hooks/useTasks';
import TaskCard from './TaskCard';
import Spinner from '../ui/Spinner';
import { HiOutlineInbox } from 'react-icons/hi';

const TaskList = ({ onEditTask }) => {
  const { tasks, loading } = useTasks();

  if (loading) {
    return (
      <div>
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <HiOutlineInbox className="empty-icon" />
        <h3>No tasks found</h3>
        <p>Create your first task to get started, or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task, index) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
