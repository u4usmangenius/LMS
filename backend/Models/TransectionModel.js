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
// Route to apply filters, pagination, and search for transactions
// Route to apply filters, pagination, and search for transactions
// Route to apply filters, pagination, and search for transactions
// Route to apply filters, pagination, and search for transactions
router.post("/api/transections/paginate", (req, res) => {
  const { page, page_size, fine, search, sortBy, sort, filter } = req.body;
  console.log(req.body, "oook");

  const pageNum = parseInt(page) || 1;
  const pageSize = parseInt(page_size) || 5;
  const offset = (pageNum - 1) * pageSize;
  let sortOrder = sort && sort.toLowerCase() === "desc" ? "DESC" : "ASC"; // default to ascending if not provided or invalid
  const validSortColumns = [
    "id",
    "roll_no",
    "name",
    "batch_year",
    "batch_time",
    "department_name",
    "category",
    "phone_no",
    "title",
    "due_date",
    "fine",
    "created_at",
    "updated_at",
  ];

  // Ensure sortBy is a valid column name
  let sortColumn = validSortColumns.includes(sortBy) ? sortBy : "created_at";

  // If sortBy is not explicitly provided, default to created_at for most recent transactions
  if (!sortBy) {
    sortColumn = "created_at";
    sortOrder = "DESC"; // Sort by created_at in descending order by default
  }

  let query = `
      SELECT id, roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine, created_at, updated_at
      FROM transections
      WHERE 1=1
    `;

  const params = [];

  // Apply fine filter if provided
  if (fine) {
    const fineValue = parseInt(fine);
    if (!isNaN(fineValue)) {
      query += ` AND fine > ?`;
      params.push(fineValue);
    } else {
      res.status(400).json({ success: false, message: "Invalid fine value" });
      return;
    }
  }

  // Apply search filter if provided
  if (search) {
    const searchParam = `%${search}%`;
    if (filter && filter !== "all") {
      if (validSortColumns.includes(filter)) {
        query += ` AND ${filter} LIKE ?`;
        params.push(searchParam);
      } else {
        res
          .status(400)
          .json({ success: false, message: "Invalid filter column" });
        return;
      }
    } else {
      query += ` AND (
          roll_no LIKE ? OR 
          name LIKE ? OR 
          department_name LIKE ? OR 
          title LIKE ? OR 
          category LIKE ? OR 
          phone_no LIKE ? OR 
          batch_year LIKE ? OR 
          batch_time LIKE ? OR 
          fine LIKE ?
        )`;
      params.push(
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam
      );
    }
  }

  query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error paginating transactions:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      db.get("SELECT COUNT(*) as count FROM transections", (err, row) => {
        if (err) {
          console.error("Error getting transaction count:", err);
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

// router.post("/api/transections/paginate", (req, res) => {
//   const { page, page_size, fine, search, sortBy, sort } = req.body;
//   const pageNum = parseInt(page) || 1;
//   const pageSize = parseInt(page_size) || 5;
//   const offset = (pageNum - 1) * pageSize;
//   const sortOrder = sort && sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
//     const validSortColumns = ['id', 'roll_no', 'name', 'batch_year', 'batch_time', 'department_name', 'category', 'phone_no', 'title', 'due_date', 'fine', 'created_at', 'updated_at'];

//   let query = `
//       SELECT id, roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine, created_at, updated_at
//       FROM transections
//       WHERE 1=1
//     `;

//   const params = [];

//   // Apply fine filter if provided
//   if (fine) {
//     query += ` AND fine > ?`;
//     params.push(fine);
//   }

//   // Apply search filter if provided
//   if (search) {
//     query += ` AND (
//         roll_no LIKE ? OR
//         name LIKE ? OR
//         department_name LIKE ? OR
//         title LIKE ? OR
//         category LIKE ? OR
//         phone_no LIKE ?
//       )`;
//     const searchParam = `%${search}%`;
//     params.push(
//       searchParam,
//       searchParam,
//       searchParam,
//       searchParam,
//       searchParam,
//       searchParam
//     );
//   }

//   query += ` LIMIT ? OFFSET ?`;
//   params.push(pageSize, offset);

//   db.all(query, params, (err, rows) => {
//     if (err) {
//       console.error("Error paginating transections:", err);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal server error" });
//     } else {
//       db.get("SELECT COUNT(*) as count FROM transections", (err, row) => {
//         if (err) {
//           console.error("Error getting transection count:", err);
//           res
//             .status(500)
//             .json({ success: false, message: "Internal server error" });
//         } else {
//           const totalCount = row.count;
//           const totalPages = Math.ceil(totalCount / pageSize);
//           res
//             .status(200)
//             .json({ success: true, transections: rows, totalPages });
//         }
//       });
//     }
//   });
// });

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
// router.post("/api/transections", (req, res) => {
//   const {
//     roll_no,
//     name,
//     batch_year,
//     batch_time,
//     department_name,
//     category,
//     phone_no,
//     title,
//     due_date,
//     fine,
//   } = req.body;

//   const query = `
//     INSERT INTO transections (roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const params = [
//     roll_no,
//     name,
//     batch_year,
//     batch_time,
//     department_name,
//     category,
//     phone_no,
//     title,
//     due_date,
//     fine,
//   ];

//   db.run(query, params, function (err) {
//     if (err) {
//       console.error("Error creating transection:", err);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal server error" });
//     } else {
//       res.status(200).json({ success: true, transectionId: this.lastID });
//     }
//   });
// });

// Add transection
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

  const bookQuery = `SELECT quantity FROM books WHERE title = ?`;

  db.get(bookQuery, [title], (err, book) => {
    if (err) {
      console.error("Error fetching book:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Book out of stock" });
    }

    // Proceed to create the transection and update the book quantity
    const transectionQuery = `
      INSERT INTO transections (roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const transectionParams = [
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

    db.run(transectionQuery, transectionParams, function (err) {
      if (err) {
        console.error("Error creating transection:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      // Update the book quantity
      const updateBookQuery = `UPDATE books SET quantity = quantity - 1 WHERE title = ?`;
      db.run(updateBookQuery, [title], function (err) {
        if (err) {
          console.error("Error updating book quantity:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        return res
          .status(200)
          .json({ success: true, transectionId: this.lastID });
      });
    });
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
// router.delete("/api/transections/:id", (req, res) => {
//   const id = req.params.id;

//   // Start a transaction to ensure atomicity
//   db.serialize(() => {
//     db.run("BEGIN TRANSACTION");

//     // Step 1: Fetch the transection details
//     const fetchQuery = "SELECT * FROM transections WHERE id = ?";
//     db.get(fetchQuery, [id], (err, row) => {
//       if (err) {
//         console.error("Error fetching transection:", err);
//         db.run("ROLLBACK");
//         return res
//           .status(500)
//           .json({ success: false, message: "Internal server error" });
//       }

//       if (!row) {
//         db.run("ROLLBACK");
//         return res
//           .status(404)
//           .json({ success: false, message: "Transection not found" });
//       }

//       // Step 2: Insert the relevant transection details into the history table
//       const insertQuery = `
//         INSERT INTO history (roll_no, name, batch_year, batch_time, department_name, category, phone_no, title, due_date, fine)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;
//       db.run(
//         insertQuery,
//         [
//           row.roll_no,
//           row.name,
//           row.batch_year,
//           row.batch_time,
//           row.department_name,
//           row.category,
//           row.phone_no,
//           row.title,
//           row.due_date,
//           row.fine,
//         ],
//         function (err) {
//           if (err) {
//             console.error("Error inserting into history:", err);
//             db.run("ROLLBACK");
//             return res
//               .status(500)
//               .json({ success: false, message: "Internal server error" });
//           }

//           // Step 3: Delete the transection from the transections table
//           const deleteQuery = "DELETE FROM transections WHERE id = ?";
//           db.run(deleteQuery, [id], function (err) {
//             if (err) {
//               console.error("Error deleting transection:", err);
//               db.run("ROLLBACK");
//               return res
//                 .status(500)
//                 .json({ success: false, message: "Internal server error" });
//             }

//             db.run("COMMIT");
//             return res.status(200).json({
//               success: true,
//               message: "Transection moved to history and deleted successfully",
//             });
//           });
//         }
//       );
//     });
//   });
// });
//  Router to delete transection
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

      const bookTitle = row.title;

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

            // Step 4: Update the book quantity
            const updateBookQuery = `UPDATE books SET quantity = quantity + 1 WHERE title = ?`;
            db.run(updateBookQuery, [bookTitle], function (err) {
              if (err) {
                console.error("Error updating book quantity:", err);
                db.run("ROLLBACK");
                return res
                  .status(500)
                  .json({ success: false, message: "Internal server error" });
              }

              db.run("COMMIT");
              return res.status(200).json({
                success: true,
                message:
                  "Transection moved to history, deleted successfully, and book quantity updated",
              });
            });
          });
        }
      );
    });
  });
});
module.exports = router;
