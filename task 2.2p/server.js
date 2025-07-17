const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage for tasks (in real app, you'd use a database)
let tasks = [
    { id: 1, title: "Learn Express.js", description: "Complete the Express.js tutorial", completed: false, priority: "high" },
    { id: 2, title: "Build REST API", description: "Create endpoints for CRUD operations", completed: false, priority: "medium" },
    { id: 3, title: "Add static files", description: "Set up public folder for serving files", completed: true, priority: "low" }
];

let nextId = 4;

// Root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json({
        success: true,
        data: tasks,
        count: tasks.length
    });
});

// GET single task by ID
app.get('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }
    
    res.json({
        success: true,
        data: task
    });
});

// POST new task
app.post('/api/tasks', (req, res) => {
    const { title, description, priority = 'medium' } = req.body;
    
    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }
    
    const newTask = {
        id: nextId++,
        title,
        description: description || '',
        completed: false,
        priority,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully'
    });
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }
    
    const { title, description, completed, priority } = req.body;
    
    // Update task properties
    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (completed !== undefined) tasks[taskIndex].completed = completed;
    if (priority !== undefined) tasks[taskIndex].priority = priority;
    
    tasks[taskIndex].updatedAt = new Date().toISOString();
    
    res.json({
        success: true,
        data: tasks[taskIndex],
        message: 'Task updated successfully'
    });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    
    res.json({
        success: true,
        data: deletedTask,
        message: 'Task deleted successfully'
    });
});

// GET tasks by priority
app.get('/api/tasks/priority/:priority', (req, res) => {
    const priority = req.params.priority.toLowerCase();
    const filteredTasks = tasks.filter(task => task.priority === priority);
    
    res.json({
        success: true,
        data: filteredTasks,
        count: filteredTasks.length,
        priority: priority
    });
});

// GET completed/incomplete tasks
app.get('/api/tasks/status/:status', (req, res) => {
    const status = req.params.status.toLowerCase();
    let filteredTasks;
    
    if (status === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (status === 'incomplete') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else {
        return res.status(400).json({
            success: false,
            message: 'Status must be "completed" or "incomplete"'
        });
    }
    
    res.json({
        success: true,
        data: filteredTasks,
        count: filteredTasks.length,
        status: status
    });
});

// PATCH toggle task completion
app.patch('/api/tasks/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    tasks[taskIndex].updatedAt = new Date().toISOString();
    
    res.json({
        success: true,
        data: tasks[taskIndex],
        message: `Task ${tasks[taskIndex].completed ? 'completed' : 'reopened'}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Task Management API is ready!`);
    console.log(`\nAPI Endpoints:`);
    console.log(`GET    /api/tasks                    - Get all tasks`);
    console.log(`GET    /api/tasks/:id                - Get task by ID`);
    console.log(`POST   /api/tasks                    - Create new task`);
    console.log(`PUT    /api/tasks/:id                - Update task`);
    console.log(`DELETE /api/tasks/:id                - Delete task`);
    console.log(`GET    /api/tasks/priority/:priority - Get tasks by priority`);
    console.log(`GET    /api/tasks/status/:status     - Get tasks by status`);
    console.log(`PATCH  /api/tasks/:id/toggle         - Toggle task completion`);
});

module.exports = app;