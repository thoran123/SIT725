const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory storage for demo (in production, use a database)
let tasks = [];
let users = {};
let chatMessages = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/api/messages', (req, res) => {
    res.json(chatMessages);
});

// Socket connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Handle user joining
    socket.on('user-joined', (userData) => {
        users[socket.id] = {
            id: socket.id,
            name: userData.name,
            avatar: userData.avatar || '👤',
            joinedAt: new Date()
        };
        
        // Send current data to new user
        socket.emit('initial-data', {
            tasks: tasks,
            messages: chatMessages.slice(-50), // Last 50 messages
            users: Object.values(users)
        });
        
        // Broadcast user joined to others
        socket.broadcast.emit('user-joined', users[socket.id]);
        
        // Send updated user list to all clients
        io.emit('users-updated', Object.values(users));
        
        console.log(`${userData.name} joined the session`);
    });

    // Handle new task creation
    socket.on('create-task', (taskData) => {
        const newTask = {
            id: Date.now().toString(),
            title: taskData.title,
            description: taskData.description,
            status: 'todo',
            priority: taskData.priority || 'medium',
            createdBy: users[socket.id]?.name || 'Anonymous',
            createdAt: new Date(),
            assignedTo: taskData.assignedTo || null
        };
        
        tasks.push(newTask);
        
        // Broadcast new task to all clients
        io.emit('task-created', newTask);
        
        // Send notification
        io.emit('notification', {
            type: 'task-created',
            message: `New task "${newTask.title}" created by ${newTask.createdBy}`,
            timestamp: new Date()
        });
    });

    // Handle task status update
    socket.on('update-task-status', (data) => {
        const task = tasks.find(t => t.id === data.taskId);
        if (task) {
            const oldStatus = task.status;
            task.status = data.status;
            task.updatedAt = new Date();
            task.updatedBy = users[socket.id]?.name || 'Anonymous';
            
            // Broadcast task update
            io.emit('task-updated', task);
            
            // Send notification
            io.emit('notification', {
                type: 'task-updated',
                message: `Task "${task.title}" moved from ${oldStatus} to ${data.status} by ${task.updatedBy}`,
                timestamp: new Date()
            });
        }
    });

    // Handle task deletion
    socket.on('delete-task', (taskId) => {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            const deletedTask = tasks.splice(taskIndex, 1)[0];
            
            // Broadcast task deletion
            io.emit('task-deleted', taskId);
            
            // Send notification
            io.emit('notification', {
                type: 'task-deleted',
                message: `Task "${deletedTask.title}" deleted by ${users[socket.id]?.name || 'Anonymous'}`,
                timestamp: new Date()
            });
        }
    });

    // Handle chat messages
    socket.on('send-message', (messageData) => {
        const message = {
            id: Date.now().toString(),
            text: messageData.text,
            sender: users[socket.id]?.name || 'Anonymous',
            senderAvatar: users[socket.id]?.avatar || '👤',
            timestamp: new Date(),
            type: messageData.type || 'text'
        };
        
        chatMessages.push(message);
        
        // Keep only last 100 messages
        if (chatMessages.length > 100) {
            chatMessages = chatMessages.slice(-100);
        }
        
        // Broadcast message to all clients
        io.emit('new-message', message);
    });

    // Handle typing indicator
    socket.on('typing-start', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('user-typing', {
                userId: socket.id,
                userName: users[socket.id].name
            });
        }
    });

    socket.on('typing-stop', () => {
        socket.broadcast.emit('user-stop-typing', socket.id);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            const userName = users[socket.id].name;
            
            // Remove user
            delete users[socket.id];
            
            // Broadcast user left
            socket.broadcast.emit('user-left', {
                userId: socket.id,
                userName: userName
            });
            
            // Send updated user list
            io.emit('users-updated', Object.values(users));
            
            console.log(`${userName} disconnected`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('Socket.IO server is ready for connections!');
});

module.exports = { app, server, io };