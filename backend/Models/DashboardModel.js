const express = require("express");
const router = express.Router();
const db = require("../db/Sqlite").db;

// Route to get the count of books, students, and transections
router.get("/api/dashboard/counts", async (req, res) => {
  try {
    const counts = {};

    const queries = [
      "SELECT COUNT(*) as count FROM books",
      "SELECT COUNT(*) as count FROM students",
      "SELECT COUNT(*) as count FROM transections",
    ];

    const [booksCount, studentsCount, transectionsCount] = await Promise.all(
      queries.map(
        (query) =>
          new Promise((resolve, reject) => {
            db.get(query, [], (err, row) => {
              if (err) reject(err);
              else resolve(row.count);
            });
          })
      )
    );

    counts["books"] = booksCount;
    counts["students"] = studentsCount;
    counts["transections"] = transectionsCount;

    res.status(200).json({ success: true, counts });
  } catch (err) {
    console.error("Error in counting from tables", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
module.exports = router;
