const mysql = require("./utils/mysql2.helper");
const { v4: uuidv4 } = require("uuid");

const socket = (io) => {
  io.on("connection", (client) => {
    client.on("users", async (data) => {
      const users = await mysql.query("SELECT * FROM users");
      io.emit("users", users);
    });

    // get messages from chat
    client.on("get_messages", async (data) => {
      const { from = null, to = null } = data;
      if (!from && !to) return;

      let sql = `SELECT * FROM chats WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?) LIMIT 1`;
      const chat = await mysql.query(sql, [from, to, to, from]);

      if (!chat?.length) {
        const set = {
          id: uuidv4(),
          from_user_id: from,
          to_user_id: to,
        };

        await mysql.query("INSERT INTO chats SET ?", set);
        io.to(set.id).emit("get_messages", null);
      }

      sql = `SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC`;
      const messages = await mysql.query(sql, [chat[0].id]);

      io.to(chat[0].id).emit("get_messages", messages);
    });

    // send message to chat
    client.on("send_message", async (data) => {
      const { chat_id, from_user_id, message } = data;
      const set = {
        id: uuidv4(),
        chat_id,
        message,
        from_user_id,
      };

      await mysql.query("INSERT INTO messages SET ?", set);

      sql = `SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC`;
      const messages = await mysql.query(sql, [chat_id]);

      io.to(chat_id).emit("get_messages", messages);
    });
  });
};

module.exports = socket;
