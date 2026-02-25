const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/authMiddleware');

// Get all todos with filtering
router.get('/', protect, async (req, res) => {
  try {
    const { status, priority, category, search, sort } = req.query;
    let query = { user: req.user._id };
    
    if (status === 'completed') query.completed = true;
    if (status === 'active') query.completed = false;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let todos = Todo.find(query);
    
    if (sort === 'oldest') todos = todos.sort({ createdAt: 1 });
    else if (sort === 'priority') {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      todos = todos.sort({ 
        $expr: {
          $switch: {
            branches: [
              { case: { $eq: ['$priority', 'critical'] }, then: 4 },
              { case: { $eq: ['$priority', 'high'] }, then: 3 },
              { case: { $eq: ['$priority', 'medium'] }, then: 2 },
              { case: { $eq: ['$priority', 'low'] }, then: 1 }
            ],
            default: 0
          }
        },
        createdAt: -1
      });
    }
    else if (sort === 'dueDate') todos = todos.sort({ dueDate: 1, createdAt: -1 });
    else todos = todos.sort({ createdAt: -1 });
    
    const result = await todos;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get statistics
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const total = await Todo.countDocuments({ user: req.user._id });
    const completed = await Todo.countDocuments({ user: req.user._id, completed: true });
    const pending = total - completed;
    const highPriority = await Todo.countDocuments({ 
      user: req.user._id, 
      priority: { $in: ['high', 'critical'] },
      completed: false
    });
    const overdue = await Todo.countDocuments({
      user: req.user._id,
      completed: false,
      dueDate: { $lt: new Date() }
    });

    const categoryStats = await Todo.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Todo.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const last7Days = await Todo.aggregate([
      { 
        $match: { 
          user: req.user._id,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      overview: { total, completed, pending, highPriority, overdue },
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byCategory: categoryStats,
      byPriority: priorityStats,
      activity: last7Days
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create todo
router.post('/', protect, async (req, res) => {
  try {
    const todo = await Todo.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update todo
router.put('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete todo
router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk delete completed
router.delete('/bulk/completed', protect, async (req, res) => {
  try {
    const result = await Todo.deleteMany({ user: req.user._id, completed: true });
    res.json({ message: `${result.deletedCount} tasks deleted`, count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle complete
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;