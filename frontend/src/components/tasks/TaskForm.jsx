import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import { useTasks } from '../../hooks/useTasks';
import { formatDateForInput } from '../../utils/helpers';
import toast from 'react-hot-toast';

const TaskForm = ({ isOpen, onClose, editingTask }) => {
  const { createTask, updateTask, fetchStats } = useTasks();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'medium',
        dueDate: formatDateForInput(editingTask.dueDate) || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
    }
    setErrors({});
  }, [editingTask, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || null,
      };

      if (editingTask) {
        await updateTask(editingTask._id, payload);
        toast.success('Task updated successfully');
      } else {
        await createTask(payload);
        toast.success('Task created successfully');
      }
      fetchStats();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">
              Title *
            </label>
            <input
              type="text"
              id="task-title"
              name="title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={handleChange}
              autoFocus
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Add some details..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
            {errors.description && (
              <span className="form-error">{errors.description}</span>
            )}
          </div>

          {/* Priority & Due Date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-duedate">
                Due Date
              </label>
              <input
                type="date"
                id="task-duedate"
                name="dueDate"
                className="form-input"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="task-submit-btn"
          >
            {loading ? (
              <Spinner />
            ) : editingTask ? (
              'Save Changes'
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
