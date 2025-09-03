const request = require('supertest');
const Client = require('socket.io-client');
const { app, server, io } = require('../app');

describe('SIT725 Socket Programming Tests', () => {
    let clientSocket;
    let serverSocket;
    
    beforeAll((done) => {
        server.listen(() => {
            const port = server.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            
            clientSocket.on('connect', done);
        });
    });
    
    afterAll(() => {
        server.close();
        clientSocket.close();
    });

    describe('HTTP Routes', () => {
        test('GET / should return index.html', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('text/html');
        });

        test('GET /api/tasks should return tasks array', async () => {
            const response = await request(app).get('/api/tasks');
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        test('GET /api/messages should return messages array', async () => {
            const response = await request(app).get('/api/messages');
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('Socket.IO Connection', () => {
        test('should connect successfully', () => {
            expect(clientSocket.connected).toBe(true);
        });

        test('should handle user joining', (done) => {
            const userData = { name: 'Test User', avatar: '👤' };
            
            clientSocket.on('initial-data', (data) => {
                expect(data).toHaveProperty('tasks');
                expect(data).toHaveProperty('messages');
                expect(data).toHaveProperty('users');
                done();
            });
            
            clientSocket.emit('user-joined', userData);
        });

        test('should handle ping/pong', (done) => {
            clientSocket.on('pong', () => {
                done();
            });
            
            clientSocket.emit('ping');
        });
    });

    describe('Task Management', () => {
        test('should create a new task', (done) => {
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                priority: 'high'
            };
            
            clientSocket.on('task-created', (task) => {
                expect(task.title).toBe(taskData.title);
                expect(task.description).toBe(taskData.description);
                expect(task.priority).toBe(taskData.priority);
                expect(task.status).toBe('todo');
                expect(task).toHaveProperty('id');
                expect(task).toHaveProperty('createdAt');
                done();
            });
            
            clientSocket.emit('create-task', taskData);
        });

        test('should update task status', (done) => {
            // First create a task
            const taskData = { title: 'Update Test Task', description: 'Test' };
            
            clientSocket.once('task-created', (createdTask) => {
                // Then update its status
                clientSocket.on('task-updated', (updatedTask) => {
                    expect(updatedTask.id).toBe(createdTask.id);
                    expect(updatedTask.status).toBe('inprogress');
                    expect(updatedTask).toHaveProperty('updatedAt');
                    done();
                });
                
                clientSocket.emit('update-task-status', {
                    taskId: createdTask.id,
                    status: 'inprogress'
                });
            });
            
            clientSocket.emit('create-task', taskData);
        });

        test('should delete a task', (done) => {
            // First create a task
            const taskData = { title: 'Delete Test Task', description: 'Test' };
            
            clientSocket.once('task-created', (createdTask) => {
                // Then delete it
                clientSocket.on('task-deleted', (taskId) => {
                    expect(taskId).toBe(createdTask.id);
                    done();
                });
                
                clientSocket.emit('delete-task', createdTask.id);
            });
            
            clientSocket.emit('create-task', taskData);
        });
    });

    describe('Chat Functionality', () => {
        test('should send and receive messages', (done) => {
            const messageData = { text: 'Hello, World!' };
            
            clientSocket.on('new-message', (message) => {
                expect(message.text).toBe(messageData.text);
                expect(message).toHaveProperty('id');
                expect(message).toHaveProperty('sender');
                expect(message).toHaveProperty('timestamp');
                done();
            });
            
            clientSocket.emit('send-message', messageData);
        });

        test('should handle typing indicators', (done) => {
            let typingReceived = false;
            let stopTypingReceived = false;
            
            // Create second client to test typing indicators
            const client2 = new Client(`http://localhost:${server.address().port}`);
            
            client2.on('connect', () => {
                client2.emit('user-joined', { name: 'Test User 2', avatar: '👤' });
                
                client2.on('user-typing', (data) => {
                    expect(data).toHaveProperty('userName');
                    typingReceived = true;
                    checkCompletion();
                });
                
                client2.on('user-stop-typing', () => {
                    stopTypingReceived = true;
                    checkCompletion();
                });
                
                // Trigger typing from first client
                clientSocket.emit('typing-start');
                
                setTimeout(() => {
                    clientSocket.emit('typing-stop');
                }, 100);
            });
            
            function checkCompletion() {
                if (typingReceived && stopTypingReceived) {
                    client2.close();
                    done();
                }
            }
        });
    });

    describe('Real-time Notifications', () => {
        test('should receive notifications for task creation', (done) => {
            clientSocket.on('notification', (notification) => {
                expect(notification).toHaveProperty('type');
                expect(notification).toHaveProperty('message');
                expect(notification).toHaveProperty('timestamp');
                expect(notification.type).toBe('task-created');
                done();
            });
            
            clientSocket.emit('create-task', {
                title: 'Notification Test Task',
                description: 'Test'
            });
        });
    });

    describe('Multi-user Functionality', () => {
        test('should handle multiple users', (done) => {
            const client2 = new Client(`http://localhost:${server.address().port}`);
            let usersUpdated = false;
            let userJoined = false;
            
            clientSocket.on('users-updated', (users) => {
                if (users.length >= 2) {
                    usersUpdated = true;
                    checkCompletion();
                }
            });
            
            clientSocket.on('user-joined', (user) => {
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('avatar');
                userJoined = true;
                checkCompletion();
            });
            
            client2.on('connect', () => {
                client2.emit('user-joined', { name: 'Second User', avatar: '👥' });
            });
            
            function checkCompletion() {
                if (usersUpdated && userJoined) {
                    client2.close();
                    done();
                }
            }
        });

        test('should handle user disconnection', (done) => {
            const client2 = new Client(`http://localhost:${server.address().port}`);
            
            clientSocket.on('user-left', (data) => {
                expect(data).toHaveProperty('userId');
                expect(data).toHaveProperty('userName');
                done();
            });
            
            client2.on('connect', () => {
                client2.emit('user-joined', { name: 'Temp User', avatar: '👤' });
                
                setTimeout(() => {
                    client2.close(); // This should trigger user-left event
                }, 100);
            });
        });
    });

    describe('Data Validation', () => {
        test('should handle empty task creation gracefully', () => {
            // This should not crash the server
            clientSocket.emit('create-task', {});
        });

        test('should handle invalid task status update', () => {
            // This should not crash the server
            clientSocket.emit('update-task-status', {
                taskId: 'invalid-id',
                status: 'invalid-status'
            });
        });

        test('should handle empty chat messages', () => {
            // This should not crash the server
            clientSocket.emit('send-message', { text: '' });
        });
    });

    describe('Performance Tests', () => {
        test('should handle multiple rapid task creations', (done) => {
            let tasksCreated = 0;
            const totalTasks = 5;
            
            clientSocket.on('task-created', () => {
                tasksCreated++;
                if (tasksCreated === totalTasks) {
                    done();
                }
            });
            
            // Create multiple tasks rapidly
            for (let i = 0; i < totalTasks; i++) {
                clientSocket.emit('create-task', {
                    title: `Rapid Task ${i}`,
                    description: `Test task ${i}`
                });
            }
        });

        test('should handle multiple rapid messages', (done) => {
            let messagesReceived = 0;
            const totalMessages = 3;
            
            clientSocket.on('new-message', () => {
                messagesReceived++;
                if (messagesReceived === totalMessages) {
                    done();
                }
            });
            
            // Send multiple messages rapidly
            for (let i = 0; i < totalMessages; i++) {
                clientSocket.emit('send-message', { text: `Message ${i}` });
            }
        });
    });

    describe('Edge Cases', () => {
        test('should handle task deletion of non-existent task', () => {
            // Should not crash the server
            clientSocket.emit('delete-task', 'non-existent-id');
        });

        test('should handle user joining without name', (done) => {
            const client2 = new Client(`http://localhost:${server.address().port}`);
            
            client2.on('connect', () => {
                client2.on('initial-data', (data) => {
                    expect(data).toHaveProperty('tasks');
                    expect(data).toHaveProperty('messages');
                    expect(data).toHaveProperty('users');
                    client2.close();
                    done();
                });
                
                // Join without proper user data
                client2.emit('user-joined', {});
            });
        });

        test('should handle long message text', (done) => {
            const longMessage = 'A'.repeat(1000);
            
            clientSocket.on('new-message', (message) => {
                expect(message.text).toBe(longMessage);
                done();
            });
            
            clientSocket.emit('send-message', { text: longMessage });
        });
    });
});

// Integration test helper functions
function waitFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Additional utility tests
describe('Utility Functions', () => {
    test('server should start on specified port', () => {
        expect(server.listening).toBe(true);
        expect(server.address()).toBeTruthy();
    });

    test('socket.io should be properly initialized', () => {
        expect(io).toBeDefined();
        expect(typeof io.emit).toBe('function');
    });
});

// Test data persistence (in-memory)
describe('Data Persistence', () => {
    test('tasks should persist across operations', (done) => {
        const taskData = { title: 'Persistence Test', description: 'Test' };
        
        clientSocket.once('task-created', (task) => {
            // Get tasks via API
            request(app)
                .get('/api/tasks')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    
                    const foundTask = res.body.find(t => t.id === task.id);
                    expect(foundTask).toBeTruthy();
                    expect(foundTask.title).toBe(taskData.title);
                    done();
                });
        });
        
        clientSocket.emit('create-task', taskData);
    });
});

console.log('✅ Test Suite: Comprehensive Socket.IO and Real-time Functionality Tests');
console.log('📊 Coverage: HTTP Routes, WebSocket Events, Task Management, Chat, Multi-user, Performance');
console.log('🔧 Framework: Jest with Socket.IO Client and Supertest');
console.log('🎯 Total Tests: 20+ test cases covering all major functionality');