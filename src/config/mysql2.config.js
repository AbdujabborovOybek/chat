const mysql = require("mysql2/promise");

const production = process.env.NODE_ENV === "production";

const pool = mysql.createPool({
  host: production ? "localhost" : process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
