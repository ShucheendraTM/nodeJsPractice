const Todo = require("../models/todo");

// Create new task
exports.createTodo = async (req, res) => {
  console.log("Creating Todo for user:", req);
  const { title, completed } = req.body;
  try {
    // Check if a Todo with the same title already exists for the user
    const existingTodo = await Todo.findOne({ title: title });
    if (existingTodo) {
      return res.status(400).json({
        status: false,
        message: `Todo with this title ${title} already exists`,
      });
    }
    const todo = await Todo.create({
      title: title,
      userId: req.user._id,
      completed: completed,
    });
    res
      .status(201)
      .json({ status: true, message: "Todo created successfully", data: todo });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Get all tasks
exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ message: "fetch successfully", status: true, todos });
};

// Update task
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete task
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted", Todo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
