const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
// Create and connect to the SQLite database
const db = new sqlite3.Database("Library.sqlite");

// Create Books
db.run(
  `
  CREATE TABLE IF NOT EXISTS books (
    bookId TEXT PRIMARY KEY,
    bookName TEXT,
    subject TEXT,
     phone INTEGER
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating teachers table:", err);
    }
  }
);

module.exports = {
  db, // Export the database instance for use in other modules
};
