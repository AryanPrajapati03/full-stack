const express = require('express');

const app = express();

app.use(express.json());

// Custom authentication middleware
function requireAuth(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== 'secret123') {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }

    next();
}

// Public GET route
app.get('/api/books', (req, res) => {
    res.json([
        { id: 1, title: 'The Alchemist' },
        { id: 2, title: 'Atomic Habits' }
    ]);
});

// requireAuth applied ONLY to POST
app.post('/api/books', requireAuth, (req, res) => {
    res.status(201).json({
        message: 'Book created successfully',
        book: req.body
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});