const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON data

// Example visitor count endpoint
let visitorCount = 0;

// Route to get visitor count
app.get('/api/visitor-count', (req, res) => {
    visitorCount++;
    res.json({ count: visitorCount });
});

// Default route (optional)
app.get('/', (req, res) => {
    res.send('Server is running. Use /api/visitor-count for visitor data.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
