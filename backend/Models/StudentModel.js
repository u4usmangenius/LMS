const express = require("express");
const router = express.Router();
const db = require("../db/Sqlite").db;
const { verifyToken } = require("./authMiddleware");

// Route to list all students
router.get("/api/students", verifyToken, (req, res) => {
  const query = `
    SELECT id, roll_no, name, address, phone_no, batch_year, batch_time, gender, department_name, image
    FROM students
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching students:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, students: rows });
    }
  });
});

// Route to paginate students with filters
router.post("/api/students/paginate", verifyToken, (req, res) => {
  const { sortBy, sortOrder, department_name, batch_time, batch_year, searchText } = req.body;
  const page = parseInt(req.body.page) || 1;
  const page_size = parseInt(req.body.pageSize) || 5;
  const sortByColumn = sortBy || "created_at";
  const sortDirection = sortOrder || "desc";
  const offset = (page - 1) * page_size;

  let query = `
    SELECT id, roll_no, name, address, phone_no, batch_year, batch_time, gender, department_name, image
    FROM students
    WHERE 1=1
  `;

  const params = [];

  if (department_name) {
    query += ` AND department_name = ?`;
    params.push(department_name);
  }

  if (batch_time) {
    query += ` AND batch_time = ?`;
    params.push(batch_time);
  }

  if (batch_year) {
    query += ` AND batch_year = ?`;
    params.push(batch_year);
  }

  if (searchText) {
    query += ` AND (roll_no LIKE ? OR name LIKE ? OR address LIKE ? OR phone_no LIKE ? OR gender LIKE ?)`;
    const search = `%${searchText}%`;
    params.push(search, search, search, search, search);
  }

  query += ` ORDER BY ${sortByColumn} ${sortDirection} LIMIT ? OFFSET ?`;
  params.push(page_size, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error paginating students:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      db.get("SELECT COUNT(*) as count FROM students WHERE 1=1" 
        + (department_name ? " AND department_name = ?" : "")
        + (batch_time ? " AND batch_time = ?" : "")
        + (batch_year ? " AND batch_year = ?" : "")
        + (searchText ? " AND (roll_no LIKE ? OR name LIKE ? OR address LIKE ? OR phone_no LIKE ? OR gender LIKE ?)" : ""),
        [
          ...(department_name ? [department_name] : []),
          ...(batch_time ? [batch_time] : []),
          ...(batch_year ? [batch_year] : []),
          ...(searchText ? [search, search, search, search, search] : [])
        ],
        (err, row) => {
          if (err) {
            console.error("Error getting student count:", err);
            res.status(500).json({ success: false, message: "Internal server error" });
          } else {
            const totalCount = row.count;
            const totalPages = Math.ceil(totalCount / page_size);
            res.status(200).json({ success: true, students: rows, totalPages });
          }
        }
      );
    }
  });
});

// Route to show a specific student
router.get("/api/students/:roll_no", verifyToken, (req, res) => {
  const roll_no = req.params.roll_no;
  const query = `
    SELECT id, roll_no, name, address, phone_no, batch_year, batch_time, gender, department_name, image
    FROM students
    WHERE roll_no = ?
  `;

  db.get(query, [roll_no], (err, student) => {
    if (err) {
      console.error("Error fetching student:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      if (student) {
        res.status(200).json({ success: true, student });
      } else {
        res.status(404).json({ success: false, message: "Student not found" });
      }
    }
  });
});

// Route to create a new student
router.post("/api/students", verifyToken, (req, res) => {
  const {
    roll_no,
    name,
    address,
    phone_no,
    batch_year,
    batch_time,
    gender,
    department_name,
    image
  } = req.body;

  const query = `
    INSERT INTO students (roll_no, name, address, phone_no, batch_year, batch_time, gender, department_name, image, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;

  const params = [
    roll_no,
    name,
    address,
    phone_no,
    batch_year,
    batch_time,
    gender,
    department_name,
    image
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error creating student:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, studentId: this.lastID });
    }
  });
});

// Route to update an existing student
router.put("/api/students/:studentId", verifyToken, (req, res) => {
  const studentId = req.params.studentId;
  const {
    roll_no,
    name,
    address,
    phone_no,
    batch_year,
    batch_time,
    gender,
    department_name,
    image
  } = req.body;

  const query = `
    UPDATE students
    SET roll_no = ?, name = ?, address = ?, phone_no = ?, batch_year = ?, batch_time = ?, gender = ?, department_name = ?, image = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
    roll_no,
    name,
    address,
    phone_no,
    batch_year,
    batch_time,
    gender,
    department_name,
    image,
    studentId
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating student:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, message: "Student updated successfully" });
    }
  });
});

// Route to delete a student
router.delete("/api/students/:id", verifyToken, (req, res) => {
  const studentId = req.params.id;

  const query = "DELETE FROM students WHERE id = ?";

  db.run(query, [studentId], function (err) {
    if (err) {
      console.error("Error deleting student:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, message: "Student deleted successfully" });
    }
  });
});

module.exports = router;
