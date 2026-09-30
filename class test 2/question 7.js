const express = require('express');
const cors = require('cors');

const app = express();

// Allow React dev server at http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

app.use(express.json());

const books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
  { id: 2, title: 'Refactoring', author: 'Martin Fowler' }
];

// Root route
app.get('/', (req, res) => {
  res.redirect('/api/books');
});

// GET /api/books
app.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Q7 with CORS running at http://localhost:${PORT}`);
});
