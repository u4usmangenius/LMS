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
//department tabel 
db.run(
  `
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(350) NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
   )
  `,
  (err)=>{
    if(err){
      console.error("Error creating Book table:", err);
    }
  }
)
//create Student tabel 
db.run(
  `
 CREATE TABLE IF NOT EXISTS student (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roll_no INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone_no VARCHAR(255) NOT NULL,
  batch_year INTEGER NOT NULL,
  batch_time VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  image BYTEA, 
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

  `,
  (err)=>{
    if(err){
      console.error("Error creating Book table:", err);
    }
  }
)

//Create Categorys table
db.run(
  `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
   )
  `,
  (err)=>{
    if(err){
      console.error("Error creating Book table:", err);
    }
  }
)
// Create Books table\
db.run(
  `
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acc_no VARCHAR(255) NOT NULL UNIQUE,
    author VARCHAR(255),
    category VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) ,
    year INT ,
    pages INT ,
    binding VARCHAR(255) ,
    remarks VARCHAR(255),
    cost DECIMAL(10, 2) ,
    quantity INT ,
    image BYTEA,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating Book table:", err);
    }
  }
);

module.exports = {
  db, // Export the database instance for use in other modules
};
