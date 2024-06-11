const express = require("express");
const router = express.Router();
const db = require("../db/Sqlite").db;
const { verifyToken } = require("./authMiddleware");

// Route to list all transections
router.get("/api/transections", (req, res) => {
  const query = `
    SELECT id, roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine, created_at, updated_at
    FROM transections
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching transections:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, transections: rows });
    }
  });
});

//json object
// {
//     "page": 1,
//     "page_size": 10,
//     "fine": 50,
//     "search": "siaf"
//     }

// Route to apply filters, pagination, and search for transections
router.post("/api/transections/paginate", (req, res) => {
  const { page, page_size, fine, search } = req.body;
  const pageNum = parseInt(page) || 1;
  const pageSize = parseInt(page_size) || 5;
  const offset = (pageNum - 1) * pageSize;

  let query = `
      SELECT id, roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine, created_at, updated_at
      FROM transections
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

  query += ` LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error paginating transections:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      db.get("SELECT COUNT(*) as count FROM transections", (err, row) => {
        if (err) {
          console.error("Error getting transection count:", err);
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        } else {
          const totalCount = row.count;
          const totalPages = Math.ceil(totalCount / pageSize);
          res
            .status(200)
            .json({ success: true, transections: rows, totalPages });
        }
      });
    }
  });
});

// Route to show a specific transection
router.get("/api/transections/:id", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT id, roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine, created_at, updated_at
    FROM transections
    WHERE id = ?
  `;

  db.get(query, [id], (err, transection) => {
    if (err) {
      console.error("Error fetching transection:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      if (transection) {
        res.status(200).json({ success: true, transection });
      } else {
        res
          .status(404)
          .json({ success: false, message: "transection not found" });
      }
    }
  });
});

// json object for create transections
// {
//     "roll_no": 12345,
//     "name": "John Doe",
//     "batch_year": 2023,
//     "batch_time": "Morning",
//     "department_name": "Computer Science",
//     "category": "Student",
//     "phone_no": "123-456-7890",
//     "title": "Database Systems",
//     "due_date": "2023-06-30T12:00:00Z",
//     "fine": 0
//   }

// Route to create a new transection
router.post("/api/transections", (req, res) => {
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
    INSERT INTO transections (roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine)
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
      console.error("Error creating transection:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res.status(200).json({ success: true, transectionId: this.lastID });
    }
  });
});

// Route to update an existing transection
router.put("/api/transections/:id", (req, res) => {
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
    UPDATE transections
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
      console.error("Error updating transection:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "transection updated successfully" });
    }
  });
});

// Route to delete a transection
router.delete("/api/transections/:id", (req, res) => {
  const id = req.params.id;

  // Start a transaction to ensure atomicity
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // Step 1: Fetch the transection details
    const fetchQuery = "SELECT * FROM transections WHERE id = ?";
    db.get(fetchQuery, [id], (err, row) => {
      if (err) {
        console.error("Error fetching transection:", err);
        db.run("ROLLBACK");
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (!row) {
        db.run("ROLLBACK");
        return res
          .status(404)
          .json({ success: false, message: "Transection not found" });
      }

      // Step 2: Insert the relevant transection details into the history table
      const insertQuery = `
        INSERT INTO history (roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(
        insertQuery,
        [
          row.roll_no,
          row.name,
          row.batch_year,
          row.batch_time,
          row.department_name,
          row.category,
          row.phone_no,
          row.title,
          row.due_date,
          row.fine,
        ],
        function (err) {
          if (err) {
            console.error("Error inserting into history:", err);
            db.run("ROLLBACK");
            return res
              .status(500)
              .json({ success: false, message: "Internal server error" });
          }

          // Step 3: Delete the transection from the transections table
          const deleteQuery = "DELETE FROM transections WHERE id = ?";
          db.run(deleteQuery, [id], function (err) {
            if (err) {
              console.error("Error deleting transection:", err);
              db.run("ROLLBACK");
              return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
            }

            db.run("COMMIT");
            return res
              .status(200)
              .json({
                success: true,
                message:
                  "Transection moved to history and deleted successfully",
              });
          });
        }
      );
    });
  });
});

module.exports = router;
