import { HiOutlinePencil, HiOutlineTrash, HiOutlineCalendar, HiCheck } from 'react-icons/hi';
import { useTasks } from '../../hooks/useTasks';
import { getDateLabel, isOverdue, getPriorityConfig } from '../../utils/helpers';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onEdit }) => {
  const { toggleTask, deleteTask, fetchStats } = useTasks();
  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isOverdue(task.dueDate, task.completed);

  const handleToggle = async () => {
    try {
      await toggleTask(task._id);
      fetchStats();
      toast.success(task.completed ? 'Task marked as pending' : 'Task completed!');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      fetchStats();
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div
      className={`task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`}
      style={{ animationDelay: '0ms' }}
    >
      {/* Checkbox */}
      <label className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          id={`task-checkbox-${task._id}`}
        />
        <span className="checkmark">
          {task.completed && <HiCheck />}
        </span>
      </label>

      {/* Content */}
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        <div className="task-meta">
          <span className={`priority-badge ${priorityConfig.className}`}>
            {priorityConfig.label}
          </span>
          {task.dueDate && (
            <span className={`task-meta-item ${overdue ? 'overdue' : ''}`}>
              <HiOutlineCalendar />
              {overdue ? 'Overdue • ' : ''}
              {getDateLabel(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button
          className="btn-icon"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label="Edit task"
          id={`edit-task-${task._id}`}
        >
          <HiOutlinePencil />
        </button>
        <button
          className="btn-icon danger"
          onClick={handleDelete}
          title="Delete task"
          aria-label="Delete task"
          id={`delete-task-${task._id}`}
        >
          <HiOutlineTrash />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
