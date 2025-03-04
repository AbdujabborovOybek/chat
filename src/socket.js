const mysql = require("./utils/mysql2.helper");
const { v4: uuidv4 } = require("uuid");

const socket = (io) => {
  io.on("connection", (client) => {
    console.log(`User connected: ${client.id}`);

    // Get users list
    client.on("users", async () => {
      try {
        const users = await mysql.query("SELECT * FROM users");
        io.emit("users", users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    });

    // Get or create chat room
    client.on("get_room", async (data) => {
      try {
        const { from = null, to = null } = data;
        if (!from || !to) return;

        let sql = `SELECT * FROM chats WHERE from_user_id = ? AND to_user_id = ?`;
        const chat1 = await mysql.query(sql, [from, to]);

        sql = `SELECT * FROM chats WHERE from_user_id = ? AND to_user_id = ?`;
        const chat2 = await mysql.query(sql, [to, from]);

        const foundChat = chat1.concat(chat2);

        if (!foundChat.length) {
          const newChat = {
            id: uuidv4(),
            from_user_id: from,
            to_user_id: to,
          };

          await mysql.query("INSERT INTO chats SET ?", newChat);
          client.join(newChat.id);
          client.emit("get_room", newChat.id);
        } else {
          client.join(foundChat[0].id);
          client.emit("get_room", foundChat[0].id);
        }
      } catch (error) {
        console.error("Error in get_room:", error);
      }
    });

    // Get messages from chat room
    client.on("get_messages", async (data) => {
      try {
        const { room_id = null } = data;
        if (!room_id) return;

        const sql = `SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC`;
        const messages = await mysql.query(sql, [room_id]);

        io.to(room_id).emit("get_messages", messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    // Send message to chat room
    client.on("send_message", async (data) => {
      try {
        const { chat_id, from_user_id, message } = data;
        if (!chat_id || !from_user_id || !message) return;

        const newMessage = {
          id: uuidv4(),
          chat_id,
          from_user_id,
          message,
        };

        await mysql.query("INSERT INTO messages SET ?", newMessage);

        const sql = `SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC`;
        const messages = await mysql.query(sql, [chat_id]);

        io.to(chat_id).emit("get_messages", messages);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle disconnection
    client.on("disconnect", () => {
      console.log(`User disconnected: ${client.id}`);
    });
  });
};

module.exports = socket;
