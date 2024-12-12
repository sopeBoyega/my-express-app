const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Function to read the visitor count from a file
const getVisitorCount = () => {
    try {
        const data = fs.readFileSync('visitorCount.txt', 'utf-8');
        return parseInt(data, 10) || 0;
    } catch (err) {
        // If file doesn't exist or is invalid, return 0
        return 0;
    }
};

// Function to save the visitor count to a file
const saveVisitorCount = (count) => {
    fs.writeFileSync('visitorCount.txt', count.toString());
};

// Initialize visitor count from file
let visitorCount = getVisitorCount();

// Route to get visitor count
app.get('/api/visitor-count', (req, res) => {
    visitorCount++;
    saveVisitorCount(visitorCount);
    res.json({ count: visitorCount });
});

// Default route (optional)
app.get('/', (req, res) => {
    res.send('Server is running. Use /api/visitor-count for visitor data.');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
