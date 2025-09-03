/**
 * Socket.IO specific tests
 */

const Client = require('socket.io-client');
const { server } = require('../app');

describe('Socket.IO Specific Tests', () => {
    let clientSocket;
    
    beforeAll((done) => {
        server.listen(() => {
            const port = server.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            clientSocket.on('connect', done);
        });
    });
    
    afterAll(() => {
        server.close();
        clientSocket.close();
    });
    
    test('should handle socket connection', () => {
        expect(clientSocket.connected).toBe(true);
    });
    
    test('should handle custom events', (done) => {
        clientSocket.emit('custom-event', { data: 'test' });
        clientSocket.on('custom-response', (data) => {
            expect(data).toBeDefined();
            done();
        });
    });
});