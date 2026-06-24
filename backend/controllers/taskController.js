const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user (with filter, search, sort)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, search, sort } = req.query;

    // Base query: only tasks belonging to logged-in user
    const query = { user: req.user._id };

    // Filter by completion status
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }

    // Search by title or description (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'priority':
        // Custom sort: high > medium > low
        sortOption = { priority: -1, createdAt: -1 };
        break;
      case 'dueDate':
        sortOption = { dueDate: 1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const tasks = await Task.find(query).sort(sortOption);

    // For priority sorting, we need custom order since string sort won't work
    if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Authorization: check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this task');
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Authorization: check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Authorization: check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Authorization: check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to modify this task');
    }

    task.completed = !task.completed;
    await task.save();

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all completed tasks
// @route   DELETE /api/tasks/completed/all
// @access  Private
const deleteCompletedTasks = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({
      user: req.user._id,
      completed: true,
    });

    res.json({
      success: true,
      message: `${result.deletedCount} completed task(s) deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, completed: true }),
      Task.countDocuments({ user: userId, completed: false }),
      Task.countDocuments({
        user: userId,
        completed: false,
        dueDate: { $lt: now, $ne: null },
      }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  deleteCompletedTasks,
  getTaskStats,
};
