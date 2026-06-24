const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  deleteCompletedTasks,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validateMiddleware');

// All routes are protected
router.use(protect);

// Stats route (must be before /:id to avoid conflict)
router.get('/stats', getTaskStats);

// Bulk delete completed tasks (must be before /:id)
router.delete('/completed/all', deleteCompletedTasks);

// Standard CRUD routes
router.route('/').get(getTasks).post(validateTask, createTask);

router.route('/:id').get(getTask).put(validateTask, updateTask).delete(deleteTask);

// Toggle completion
router.patch('/:id/toggle', toggleTask);

module.exports = router;
