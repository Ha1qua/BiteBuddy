// models/sessionModel.js
const db = require("../services/db");

const storeSession = async (tableNumber) => {
  const query = "INSERT INTO sessions (table_number) VALUES (?)";
  await db.query(query, [tableNumber]); // Only tableNumber is passed
};
const deleteExpiredSessions = async () => {
  try {
    const query =
      "DELETE FROM sessions WHERE created_at < NOW() - INTERVAL 2 MINUTE";

    const [result] = await db.query(query); // Ensure the query response is destructured properly

    console.log(`${result.affectedRows || 0} expired session(s) deleted.`);
  } catch (error) {
    console.error("Error deleting expired sessions:", error);
  }
};

module.exports = {
  storeSession,
  deleteExpiredSessions,
};
