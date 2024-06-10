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
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      const books = rows.map((book) => ({
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
        quantity: book.quantity,
      }));
      res.status(200).json({ success: true, books });
    }
  });
});

// Route to apply fillter of category with pagination 
router.post("/api/books/paginate/category", verifyToken, (req, res) => {
  const { category } = req.body;
  const page = parseInt(req.body.page) || 1;
  const page_size = parseInt(req.body.page_size) || 5;
  const offset = (page - 1) * page_size;

  let query = `
    SELECT id, acc_no, title, publisher, year, pages, binding, remarks, cost, quantity, author, category
    FROM books
    WHERE 1=1
  `;

  const params = [];

  // Apply category filter if provided
  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  query += ` LIMIT ? OFFSET ?`;
  params.push(page_size, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error paginating books:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      db.get("SELECT COUNT(*) as count FROM books", (err, row) => {
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


// {
//   "page": 1,
//   "page_size": 10,
//   "sortBy": "created_at",
//   "sortOrder": "desc",
//   "category": "Programming",
//   "author": "John Doe",
//   "searchText": "JavaScript"
// }

//update.........
// Route to paginate books , saerch by name and filter , having some updates from usman
router.post("/api/books/paginate", verifyToken, (req, res) => {
  const { sortBy, sortOrder, search, category } = req.body; // Include category in destructuring
  const page = parseInt(req.body.page) || 1;
  const page_size = parseInt(req.body.pageSize) || 5;
  const filter = req.body.filter || "";
  const sortByColumn = sortBy || "created_at";
  const sortDirection = sortOrder || "desc";
  const offset = (page - 1) * page_size;

  let query = `
    SELECT id, acc_no, title, publisher, year, pages, binding, remarks, cost, quantity, author, category
    FROM books
    WHERE 1=1
  `;

  const params = [];

  // Add condition to filter by category if a value is received and not empty
  if (category && category.trim() !== "") {
    // Check if category is provided and not empty
    query += ` AND category = ?`;
    params.push(category);
  }

  if (
    filter === "acc_no" ||
    filter === "title" ||
    filter === "author" ||
    filter === "publisher" ||
    filter === "category" ||
    filter === "remarks" ||
    filter === "cost" ||
    filter === "quantity"

  ) {
    query += ` AND ${filter} LIKE ?`;
    params.push(`%${search}%1`);
  } else if (filter === "all") {
    // Handle global search
    query += ` AND (acc_no LIKE ? OR title LIKE ? OR author LIKE ? OR publisher LIKE ? OR category LIKE ? OR remarks LIKE ? OR cost LIKE ? OR quantity LIKE ?)`;
    params.push(
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    );
  }
  query += ` ORDER BY ${sortByColumn} ${sortDirection} LIMIT ? OFFSET ?`;
  params.push(page_size, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error paginating books:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      db.get("SELECT COUNT(*) as count FROM books", (err, row) => {
        if (err) {
          console.error("Error getting book count:", err);
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
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
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
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
          quantity: book.quantity,
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
  const {
    acc_no,
    author,
    category,
    title,
    publisher,
    year,
    pages,
    binding,
    remarks,
    cost,
    quantity,
  } = req.body;

  const query = `
    INSERT INTO books (acc_no, author, category, title, publisher, year, pages, binding, remarks, cost, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    acc_no,
    author,
    category,
    title,
    publisher,
    year,
    pages,
    binding,
    remarks,
    cost,
    quantity,
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error creating book:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, bookId: this.lastID });
    }
  });
});

// Route to update an existing book, delete by id not by acc_name, it may require for delete
router.put("/api/books/:bookId", verifyToken, (req, res) => {
  const bookId = req.params.bookId;
  const {
    acc_no,
    author,
    category,
    title,
    publisher,
    year,
    pages,
    binding,
    remarks,
    cost,
    quantity,
  } = req.body;

  const query = `
    UPDATE books
    SET acc_no = ?, author = ?, category = ?, title = ?, publisher = ?, year = ?, pages = ?, binding = ?, remarks = ?, cost = ?, quantity = ?
    WHERE id = ?
  `;

  const params = [
    acc_no,
    author,
    category,
    title,
    publisher,
    year,
    pages,
    binding,
    remarks,
    cost,
    quantity,
    bookId,
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating book:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Book updated successfully" });
    }
  });
});

// Route to delete a book
router.delete("/api/books/:id", verifyToken, (req, res) => {
  const bookId = req.params.id;

  const query = "DELETE FROM books WHERE id = ?";

  db.run(query, [bookId], function (err) {
    if (err) {
      console.error("Error deleting book:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Book deleted successfully" });
    }
  });
});
module.exports = router;
