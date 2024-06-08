const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("Library.sqlite");
const bcrypt = require("bcrypt");
// Create and connect to the SQLite database




// crating login user
// Creating login user table
async function createUserTable() {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS user (
        username varchar(255) PRIMARY KEY,
        password varchar(255)
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating user table:", err);
          reject(err);
        } else {
          console.log("Successfully created user table");
          resolve();
        }
      }
    );
  });
}

// Logged in user credentials
const data = {
  username: "admin",
  password: "admin",
};

async function insertUser() {
  try {
    await createUserTable(); // Wait for table creation to complete
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [data.username, data.password],
        (err) => {
          if (err) {
            console.error("Error inserting user:", err);
            reject(err);
          } else {
            console.log("Admin user created");
            resolve();
          }
        }
      );
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

// Call the function to insert the user
insertUser();

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
