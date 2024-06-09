const express = require("express");
const router = express.Router();
const db = require("../db/Sqlite").db;
const { verifyToken } = require("./authMiddleware");

// Route to list all books
router.get("/api/books", verifyToken, (req, res) => {
  const query = `
    SELECT id, acc_no, title, publisher, year, pages, binding, remarks, cost, quantity, author, category
    FROM books
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching books:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      const books = rows.map(book => ({
        id: book.id,
        acc_no: book.acc_no,
        author: book.author,
        category: book.category,
        title: book.title,
        publisher: book.publisher,
        year: book.year,
        pages: book.pages,
        binding: book.binding,
        remarks: book.remarks,
        cost: book.cost,
        quantity: book.quantity
      }));
      res.status(200).json({ success: true, books });
    }
  });
});

// Route to paginate books , saerch by name and filter 
router.post("/api/books/paginate", verifyToken, (req, res) => {
  const { page, page_size, sortBy, sortOrder, category, author, searchText } = req.body;
  const sortByColumn = sortBy || 'created_at';
  const sortDirection = sortOrder || 'desc';
  const offset = (page - 1) * page_size;

  let query = `
    SELECT id, acc_no, title, publisher, year, pages, binding, remarks, cost, quantity, author, category
    FROM books
    WHERE 1=1
  `;

  const params = [];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (author) {
    query += ` AND author = ?`;
    params.push(author);
  }

  if (searchText) {
    query += ` AND title LIKE ?`;
    params.push(`%${searchText}%`);
  }

  query += ` ORDER BY ${sortByColumn} ${sortDirection} LIMIT ? OFFSET ?`;
  params.push(page_size, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error paginating books:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      db.get("SELECT COUNT(*) as count FROM books WHERE 1=1" + (category ? " AND category = ?" : "") + (author ? " AND author = ?" : "") + (searchText ? " AND title LIKE ?" : ""), 
        category ? (author ? (searchText ? [category, author, `%${searchText}%`] : [category, author]) : (searchText ? [category, `%${searchText}%`] : [category])) : (author ? (searchText ? [author, `%${searchText}%`] : [author]) : (searchText ? [`%${searchText}%`] : [])),
      (err, row) => {
        if (err) {
          console.error("Error getting book count:", err);
          res.status(500).json({ success: false, message: "Internal server error" });
        } else {
          const totalCount = row.count;
          const totalPages = Math.ceil(totalCount / page_size);
          res.status(200).json({ success: true, books: rows, totalPages });
        }
      });
    }
  });
});


// Route to show a specific book
router.get("/api/books/:acc_no", verifyToken, (req, res) => {
  const acc_no = req.params.acc_no;
  const query = `
    SELECT id, acc_no, title, publisher, year, pages, binding, remarks, cost, quantity, author, category
    FROM books
    WHERE acc_no = ?
  `;

  db.get(query, [acc_no], (err, book) => {
    if (err) {
      console.error("Error fetching book:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      if (book) {
        const bookDetails = {
          id: book.id,
          acc_no: book.acc_no,
          author: book.author,
          category: book.category,
          title: book.title,
          publisher: book.publisher,
          year: book.year,
          pages: book.pages,
          binding: book.binding,
          remarks: book.remarks,
          cost: book.cost,
          quantity: book.quantity
        };
        res.status(200).json({ success: true, book: bookDetails });
      } else {
        res.status(404).json({ success: false, message: "Book not found" });
      }
    }
  });
});

// Route to create a new book
router.post("/api/books", verifyToken, (req, res) => {
  const { acc_no, author, category, title, publisher, year, pages, binding, remarks, cost, quantity } = req.body;

  const query = `
    INSERT INTO books (acc_no, author, category, title, publisher, year, pages, binding, remarks, cost, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [acc_no, author, category, title, publisher, year, pages, binding, remarks, cost, quantity];

  db.run(query, params, function(err) {
    if (err) {
      console.error("Error creating book:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, bookId: this.lastID });
    }
  });
});

// Route to update an existing book
router.put("/api/books/:acc_no", verifyToken, (req, res) => {
  const bookId = req.params.acc_no;
  const { acc_no, author, category, title, publisher, year, pages, binding, remarks, cost, quantity } = req.body;

  const query = `
    UPDATE books
    SET acc_no = ?, author = ?, category = ?, title = ?, publisher = ?, year = ?, pages = ?, binding = ?, remarks = ?, cost = ?, quantity = ?
    WHERE acc_no = ?
  `;

  const params = [acc_no, author, category, title, publisher, year, pages, binding, remarks, cost, quantity, bookId];

  db.run(query, params, function(err) {
    if (err) {
      console.error("Error updating book:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, message: "Book updated successfully" });
    }
  });
});

// Route to delete a book
router.delete("/api/books/:acc_no",verifyToken,  (req, res) => {
  const bookId = req.params.acc_no;

  const query = "DELETE FROM books WHERE acc_no = ?";

  db.run(query, [bookId], function(err) {
    if (err) {
      console.error("Error deleting book:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, message: "Book deleted successfully" });
    }
  });
});
module.exports = router;
