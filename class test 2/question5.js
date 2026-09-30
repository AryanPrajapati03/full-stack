const express = require('express');
const app = express();

let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt' }
];

// Root route
app.get('/', (req, res) => {
  res.send('Server Q5 running! Try accessing: <a href="/api/books/1">/api/books/1</a> or <a href="/api/books/99">/api/books/99</a> (404)');
});

// Fixed route with 404 validation check
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.status(200).json({ title: book.title });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Q5 running at http://localhost:${PORT}`);
});