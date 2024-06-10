const express = require("express");
const router = express.Router();
const db = require("../db/Sqlite").db;
const { verifyToken } = require("./authMiddleware");

// List all departments
router.get("/api/departments", verifyToken, async (req, res) => {
  const query = "SELECT * FROM departments";
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching departments:", err);
      res.status(500).json({ error: "Failed to fetch departments" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Paginate departments and search by name
router.post("/api/departments/paginate", verifyToken, async (req, res) => {
  const { sortBy, sortOrder, searchText } = req.body;
  const page = parseInt(req.body.page) || 1;
  const page_size = parseInt(req.body.pageSize) || 5;
  const sortByColumn = sortBy || "created_at";
  const sortDirection = sortOrder || "desc";
  const offset = (page - 1) * page_size;

  let query = `
    SELECT * FROM departments 
    WHERE 1=1
  `;

  const params = [];

  if (searchText) {
    query += ` AND name LIKE ?`;
    params.push(`%${searchText}%`);
  }

  query += ` ORDER BY ${sortByColumn} ${sortDirection} LIMIT ? OFFSET ?`;
  params.push(page_size, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching departments:", err);
      res.status(500).json({ error: "Failed to fetch departments" });
    } else {
      db.get("SELECT COUNT(*) as count FROM departments WHERE 1=1" + (searchText ? " AND name LIKE ?" : ""), 
        searchText ? [`%${searchText}%`] : [], 
      (err, row) => {
        if (err) {
          console.error("Error counting departments:", err);
          res.status(500).json({ error: "Failed to fetch departments count" });
        } else {
          const totalCount = row.count;
          const totalPages = Math.ceil(totalCount / page_size);
          res.status(200).json({ departments: rows, totalPages });
        }
      });
    }
  });
});

// Show a specific department
router.get("/api/departments/:id", verifyToken, async (req, res) => {
  const query = "SELECT * FROM departments WHERE id = ?";
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      console.error("Error fetching department:", err);
      res.status(500).json({ error: "Failed to fetch department" });
    } else {
      res.status(200).json(row);
    }
  });
});

// Create a new department
router.post("/api/departments", verifyToken, async (req, res) => {
  const { name } = req.body;

  // Query to check if the department name already exists
  const checkQuery = `
    SELECT COUNT(*) as count FROM departments WHERE name = ?
  `;

  db.get(checkQuery, [name], (err, row) => {
    if (err) {
      console.error("Error checking department:", err);
      res.status(500).json({ error: "Failed to check department" });
    } else if (row.count > 0) {
      res.status(400).json({ error: "Department already exists" });
    } else {
      // If the department does not exist, insert it
      const insertQuery = `
        INSERT INTO departments (name, created_at, updated_at) 
        VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;

      db.run(insertQuery, [name], function (err) {
        if (err) {
          console.error("Error creating department:", err);
          res.status(500).json({ error: "Failed to create department" });
        } else {
          res.status(200).json({ id: this.lastID, name });
        }
      });
    }
  });
});

// Update an existing department
router.put("/api/departments/:id", verifyToken, async (req, res) => {
  const { name } = req.body;
  
  const query = `
    UPDATE departments 
    SET name = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;
  
  db.run(query, [name, req.params.id], function (err) {
    if (err) {
      console.error("Error updating department:", err);
      res.status(500).json({ error: "Failed to update department" });
    } else {
      res.status(200).json({ id: req.params.id, name });
    }
  });
});

// Delete a department
router.delete("/api/departments/:id", verifyToken, async (req, res) => {
  const query = "DELETE FROM departments WHERE id = ?";
  
  db.run(query, [req.params.id], function (err) {
    if (err) {
      console.error("Error deleting department:", err);
      res.status(500).json({ error: "Failed to delete department" });
    } else {
      res.status(200).send();
    }
  });
});

module.exports = router;
