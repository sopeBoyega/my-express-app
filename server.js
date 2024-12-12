const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import PostgreSQL library

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Provided by Render
    ssl: {
        rejectUnauthorized: false // For secure connections (Render-specific)
    }
});

// Ensure the visitor_count table exists and initialize data
(async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS visitor_count (
                id SERIAL PRIMARY KEY,
                count INTEGER DEFAULT 0
            );
        `);

        // Insert initial count if not already present
        const result = await client.query(`SELECT COUNT(*) FROM visitor_count;`);
        if (parseInt(result.rows[0].count, 10) === 0) {
            await client.query(`INSERT INTO visitor_count (count) VALUES (0);`);
        }

        console.log('Database is set up and ready!');
    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        client.release();
    }
})();

// Route to get and increment visitor count
app.get('/api/visitor-count', async (req, res) => {
    try {
        const client = await pool.connect();
        const updateResult = await client.query(`
            UPDATE visitor_count
            SET count = count + 1
            RETURNING count;
        `);
        client.release();

        res.json({ count: updateResult.rows[0].count });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
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
