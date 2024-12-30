const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 10000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false  // Disable CSP for development
}));

// CORS configuration
app.use(cors({
    origin: '*',  // Configure according to your needs
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Logging middleware
app.use(morgan('dev'));

// Request validation middleware
const validateRequest = (req, res, next) => {
    if (req.method === 'POST' && (!req.body || Object.keys(req.body).length === 0)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Request body is empty or invalid'
        });
    }
    next();
};

// Routes
app.get('/server-info', (req, res) => {
    try {
        const serverInfo = {
            port: port,
            local: `http://localhost:${port}`,
            network: `http://${getIPAddress()}:${port}`,
            timestamp: new Date().toISOString()
        };
        res.json(serverInfo);
    } catch (error) {
        next(error);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/', validateRequest, (req, res) => {
    try {
        console.log('Received data:', req.body);
        res.json({
            success: true,
            message: 'Data received successfully',
            receivedData: req.body,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        path: req.url,
        timestamp: new Date().toISOString()
    });
});

// Helper function to get IP address
function getIPAddress() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();

    try {
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip internal and non-IPv4 addresses
                if (net.family === 'IPv4' && !net.internal) {
                    return net.address;
                }
            }
        }
        return '0.0.0.0';
    } catch (error) {
        console.error('Error getting IP address:', error);
        return '0.0.0.0';
    }
}

// Start server
app.listen(port, () => {
    console.log('=================================');
    console.log(`Server is running on port ${port}`);
    console.log(`Local: http://localhost:${port}`);
    console.log(`Network: http://${getIPAddress()}:${port}`);
    console.log('=================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});