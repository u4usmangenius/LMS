const express = require("express");
const router = express.Router();
const db = require("../db/Sqlite").db;
const { verifyToken } = require("./authMiddleware");

// Route to list all history
router.get("/api/history", (req, res) => {
  const query = `
    SELECT id, roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine, created_at, updated_at
    FROM history
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching history:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, history: rows });
    }
  });
});

// Route to apply filters, pagination, and search for history
router.post("/api/history/paginate", (req, res) => {
  const { fine, search, sortBy, sortOrder } = req.body;
  const page = parseInt(req.body.page) || 1;
  const page_size = parseInt(req.body.pageSize) || 5;
  const sortByColumn = sortBy || "created_at"; // Adjust this to your desired default sort column
  const sortDirection = sortOrder === "asc" ? "ASC" : "DESC";
  const offset = (page - 1) * page_size;

  let query = `
    SELECT * FROM history
    WHERE 1=1
  `;

  const params = [];

  // Apply fine filter if provided
  if (fine) {
    query += ` AND fine > ?`;
    params.push(fine);
  }

  // Apply search filter if provided
  if (search) {
    query += ` AND (
      roll_no LIKE ? OR 
      name LIKE ? OR 
      department_name LIKE ? OR 
      title LIKE ? OR 
      category LIKE ? OR 
      phone_no LIKE ?
    )`;
    const searchParam = `%${search}%`;
    params.push(
      searchParam,
      searchParam,
      searchParam,
      searchParam,
      searchParam,
      searchParam
    );
  }

  query += ` ORDER BY ${sortByColumn} ${sortDirection} LIMIT ? OFFSET ?`;
  params.push(page_size, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error paginating history:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      let countQuery = "SELECT COUNT(*) as count FROM history WHERE 1=1";
      const countParams = [];

      if (fine) {
        countQuery += " AND fine > ?";
        countParams.push(fine);
      }

      if (search) {
        const searchParam = `%${search}%`; // Define searchParam here
        countQuery += ` AND (
          roll_no LIKE ? OR 
          name LIKE ? OR 
          department_name LIKE ? OR 
          title LIKE ? OR 
          category LIKE ? OR 
          phone_no LIKE ?
        )`;
        countParams.push(
          searchParam,
          searchParam,
          searchParam,
          searchParam,
          searchParam,
          searchParam
        );
      }

      db.get(countQuery, countParams, (err, row) => {
        if (err) {
          console.error("Error getting history count:", err);
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        } else {
          const totalCount = row.count;
          const totalPages = Math.ceil(totalCount / page_size);
          res.status(200).json({ success: true, history: rows, totalPages });
        }
      });
    }
  });
});

// Route to show a specific history
router.get("/api/history/:id", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT id, roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine, created_at, updated_at
    FROM history
    WHERE id = ?
  `;

  db.get(query, [id], (err, history) => {
    if (err) {
      console.error("Error fetching history:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      if (history) {
        res.status(200).json({ success: true, history });
      } else {
        res.status(404).json({ success: false, message: "history not found" });
      }
    }
  });
});

// Route to create a new history
router.post("/api/history", (req, res) => {
  const {
    roll_no,
    name,
    batch_year,
    batch_time,
    department_name,
    category,
    phone_no,
    title,
    due_date,
    fine,
  } = req.body;

  const query = `
    INSERT INTO history (roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    roll_no,
    name,
    batch_year,
    batch_time,
    department_name,
    category,
    phone_no,
    title,
    due_date,
    fine,
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error creating history:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, historyId: this.lastID });
    }
  });
});

// Route to update an existing history
router.put("/api/history/:id", (req, res) => {
  const id = req.params.id;
  const {
    roll_no,
    name,
    batch_year,
    batch_time,
    department_name,
    category,
    phone_no,
    title,
    due_date,
    fine,
  } = req.body;

  const query = `
    UPDATE history
    SET roll_no = ?, name = ?, batch_year = ?, batch_time = ?, department_name = ?, category = ?, phone_no = ?, title = ?, due_date = ?, fine = ?
    WHERE id = ?
  `;

  const params = [
    roll_no,
    name,
    batch_year,
    batch_time,
    department_name,
    category,
    phone_no,
    title,
    due_date,
    fine,
    id,
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating history:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "history updated successfully" });
    }
  });
});

// Route to delete a history
router.delete("/api/history/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM history WHERE id = ?";

  db.run(query, [id], function (err) {
    if (err) {
      console.error("Error deleting history:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "history deleted successfully" });
    }
  });
});

module.exports = router;
