const cron = require('node-cron');
const db = require("../db/Sqlite").db;

// Function to update fines for overdue transactions
const updateFines = () => {
  const query = `
    UPDATE transections
    SET fine = 10 * CAST((julianday('now') - julianday(due_date)) AS INTEGER)
    WHERE due_date < date('now')
  `;

  db.run(query, [], (err) => {
    if (err) {
      console.error('Error updating fines:', err);
    } else {
      console.log('Fines updated successfully');
    }
  });
};

// Schedule the task to run at midnight every day
//'0 0 * * *'  (run after 24 hours)
cron.schedule('*/1 * * * *', () => {
  console.log('Running daily fine update task');
  updateFines();
});

// Export the updateFines function (optional, for manual trigger)
module.exports = {
  updateFines
};
