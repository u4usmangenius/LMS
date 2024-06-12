const express = require("express");
const router = express.Router();
const db = require("../db/Sqlite").db;

// Route to get the count of books, students, and transections
router.get("/api/dashboard/counts", (req, res) => {
  const query = `
    SELECT 'books' as table_name, COUNT(*) as count FROM books
    UNION ALL
    SELECT 'students' as table_name, COUNT(*) as count FROM students
    UNION ALL
    SELECT 'transections' as table_name, COUNT(*) as count FROM transections
  `;

  db.all(query, [], (err, rows) => {
    const counts = {};
    rows.forEach((row) => {
      counts[row.table_name] = row.count;
    });
    if (err) {
      console.log("error in counting from tables", err);
    } else {
      res.status(200).json({ success: true, counts });
    }
    // this response return this object
    // {
    //     "success": true,
    //     "counts": {
    //         "books": 5,
    //         "students": 1,
    //         "transections": 20
    //     }
    // }
  });
});

module.exports = router;
