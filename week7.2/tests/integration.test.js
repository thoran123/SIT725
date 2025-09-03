/**
 * Integration tests
 */

const request = require('supertest');
const Client = require('socket.io-client');
const { app, server } = require('../app');

describe('Integration Tests', () => {
    test('should integrate HTTP and WebSocket', async () => {
        const httpResponse = await request(app).get('/api/tasks');
        expect(httpResponse.status).toBe(200);
        
        const clientSocket = new Client(`http://localhost:${server.address().port}`);
        
        return new Promise((resolve) => {
            clientSocket.on('connect', () => {
                expect(clientSocket.connected).toBe(true);
                clientSocket.close();
                resolve();
            });
        });
    });
});