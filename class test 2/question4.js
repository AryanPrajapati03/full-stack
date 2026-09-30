const express = require('express');

const app = express();
app.use(express.json());

let books = [
    { id: 1, title: 'The Alchemist', author: 'Paulo Coelho' },
    { id: 2, title: '1984', author: 'George Orwell' }
];

// GET - List all books
app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});

// POST - Create a new book
app.post('/api/books', (req, res) => {
    const { title, author } = req.body;

    const newBook = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
        title: title,
        author: author
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// DELETE - Delete a book
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: 'Book deleted successfully',
        book: deletedBook[0]
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});