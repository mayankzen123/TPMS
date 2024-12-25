const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Get server info
app.get('/server-info', (req, res) => {
    const serverInfo = {
        port: port,
        local: `http://localhost:${port}`,
        network: `http://${getIPAddress()}:${port}`
    };
    res.json(serverInfo);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST endpoint
app.post('/', (req, res) => {
    console.log('Received data:', req.body);
    res.json({ 
        message: 'Data received successfully',
        receivedData: req.body 
    });
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Local: http://localhost:${port}`);
    console.log(`On Your Network: http://${getIPAddress()}:${port}`);
});

// Helper function to get IP address
function getIPAddress() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip internal and non-IPv4 addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '0.0.0.0';
}