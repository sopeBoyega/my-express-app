const express = require('express');
const app = express();

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/api/visitor-count', (req, res) => {
    res.json({ count: 123 });
});


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
