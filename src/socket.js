const mysql = require("./utils/mysql2.helper");

const socket = (io) => {
  io.on("connection", (client) => {
    client.on("users", async (data) => {
      const users = await mysql.query("SELECT * FROM users");
      io.emit("users", users);
    });
  });
};

module.exports = socket;
