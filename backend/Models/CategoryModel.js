const express = require("express");
const router = express.Router();
const db = require("../db/Sqlite").db;

// List all categories
router.get("/api/categories", async (req, res) => {
  const query = "SELECT * FROM categories";
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ error: "Failed to fetch categories" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Paginate categories and search by name
router.post("/api/categories/paginate", async (req, res) => {
    const { page, page_size, sortBy, sortOrder, searchText } = req.body;
    const sortByColumn = sortBy || "created_at";
    const sortDirection = sortOrder || "desc";
    const offset = (page - 1) * page_size;
  
    let query = `
      SELECT * FROM categories 
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
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
      } else {
        db.get("SELECT COUNT(*) as count FROM categories WHERE 1=1" + (searchText ? " AND name LIKE ?" : ""), 
          searchText ? [`%${searchText}%`] : [], 
        (err, row) => {
          if (err) {
            console.error("Error counting categories:", err);
            res.status(500).json({ error: "Failed to fetch categories count" });
          } else {
            const totalCount = row.count;
            const totalPages = Math.ceil(totalCount / page_size);
            res.status(200).json({ categories: rows, totalPages });
          }
        });
      }
    });
  });

// Show a specific category
router.get("/api/categories/:id", async (req, res) => {
  const query = "SELECT * FROM categories WHERE id = ?";
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      console.error("Error fetching category:", err);
      res.status(500).json({ error: "Failed to fetch category" });
    } else {
      res.status(200).json(row);
    }
  });
});

// Create a new category
router.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  
  const query = `
    INSERT INTO categories (name, created_at, updated_at) 
    VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
  
  db.run(query, [name], function (err) {
    if (err) {
      console.error("Error creating category:", err);
      res.status(500).json({ error: "Failed to create category" });
    } else {
      res.status(200).json({ id: this.lastID, name });
    }
  });
});

// Update an existing category
router.put("/api/categories/:id", async (req, res) => {
    const { name } = req.body;
    
    const query = `
      UPDATE categories 
      SET name = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    db.run(query, [name, req.params.id], function (err) {
      if (err) {
        console.error("Error updating category:", err);
        res.status(500).json({ error: "Failed to update category" });
      } else {
        res.status(200).json({ id: req.params.id, name });
      }
    });
  }); 

// Delete a category
router.delete("/api/categories/:id", async (req, res) => {
  const query = "DELETE FROM categories WHERE id = ?";
  
  db.run(query, [req.params.id], function (err) {
    if (err) {
      console.error("Error deleting category:", err);
      res.status(500).json({ error: "Failed to delete category" });
    } else {
      res.status(200).send();
    }
  });
});

module.exports = router;
