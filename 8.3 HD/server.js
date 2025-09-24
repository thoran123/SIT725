// SIT725 Applied Software Engineering - Docker HD Assignment
// Student: Thoran Kumar Cherukuru Ramesh (s224967779)
// Express server for client-side project dockerization

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://code.jquery.com", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://d3js.org"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
            connectSrc: ["'self'", "https:", "wss:"]
        }
    }
}));

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (your existing HTML, CSS, JS files)
app.use(express.static(path.join(__dirname)));

// REQUIRED: Student identification endpoint for HD submission
app.get('/api/student', (req, res) => {
    const studentInfo = {
        name: "Thoran Kumar Cherukuru Ramesh",
        studentId: "s224967779",
        subject: "SIT725 - Applied Software Engineering",
        assignment: "8.3HD Docker Implementation",
        submissionDate: new Date().toISOString(),
        dockerVersion: "latest",
        nodeVersion: process.version,
        platform: process.platform,
        applicationStatus: "running",
        uptime: Math.floor(process.uptime()),
        memoryUsage: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development',
        projectType: "Client-side application with Express server"
    };
    
    console.log(`[${new Date().toISOString()}] Student API accessed: ${studentInfo.name}`);
    res.status(200).json(studentInfo);
});

// Health check endpoint for Docker monitoring
app.get('/api/health', (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        memory: process.memoryUsage(),
        version: "1.0.0",
        student: "s224967779",
        filesServed: ["index.html", "login.html", "support.html", "styles.css", "globe.js"]
    };
    res.status(200).json(health);
});

// Application info endpoint
app.get('/api/info', (req, res) => {
    res.status(200).json({
        application: "SIT725 Applied Software Engineering Project",
        student: "Thoran Kumar Cherukuru Ramesh",
        studentId: "s224967779",
        dockerized: true,
        version: "1.0.0",
        projectType: "Client-side Globe Visualization with Express Server",
        pages: [
            { name: "Home", path: "/", file: "index.html" },
            { name: "Login", path: "/login.html", file: "login.html" },
            { name: "Support", path: "/support.html", file: "support.html" }
        ],
        apis: [
            "/api/student",
            "/api/health", 
            "/api/info"
        ]
    });
});

// Serve your main page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve support page  
app.get('/support', (req, res) => {
    res.sendFile(path.join(__dirname, 'support.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: req.path,
        student: "s224967779"
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
        availableEndpoints: ['/api/student', '/api/health', '/api/info']
    });
});

// 404 handler for other routes - serve index.html (SPA behavior)
app.use('*', (req, res) => {
    // For non-API routes, serve the main page
    if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(404).json({
            error: 'Not found',
            path: req.originalUrl,
            timestamp: new Date().toISOString()
        });
    }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SIT725 Applied Software Engineering Application`);
    console.log(`👨‍💻 Student: Thoran Kumar Cherukuru Ramesh (s224967779)`);
    console.log(`🐳 Docker Container running on port ${PORT}`);
    console.log(`📍 Main App: http://localhost:${PORT}`);
    console.log(`🆔 Student API: http://localhost:${PORT}/api/student`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
    console.log(`ℹ️ Info: http://localhost:${PORT}/api/info`);
    console.log(`📄 Pages: index.html, login.html, support.html`);
});