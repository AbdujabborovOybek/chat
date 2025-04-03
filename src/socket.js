const mysql = require("./utils/mysql2.helper");
const { v4: uuidv4 } = require("uuid");
const redisClient = require("./config/redis");

const socket = (io) => {
  io.on("connection", (client) => {
    console.log(`User connected: ${client.id}`);

    // Get users list
    client.on("users", async () => {
      try {
        const fromCache = await redisClient.get("rtch_users");
        if (fromCache) {
          return io.emit("users", JSON.parse(fromCache));
        }

        const users = await mysql.query("SELECT * FROM users");

        await redisClient.set("rtch_users", JSON.stringify(users), { EX: 300 });
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

        const fromCache = await redisClient.get(`rtch_chat_${from}_${to}`);
        if (fromCache) {
          client.join(fromCache);
          return client.emit("get_room", fromCache);
        }

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

          await redisClient.set(`rtch_chat_${from}_${to}`, newChat.id, {
            EX: 300,
          });

          await mysql.query("INSERT INTO chats SET ?", newChat);
          client.join(newChat.id);
          client.emit("get_room", newChat.id);
        } else {
          await redisClient.set(`rtch_chat_${from}_${to}`, foundChat[0].id, {
            EX: 300,
          });

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

        const fromCache = await redisClient.get(`rtch_messages_${room_id}`);
        if (fromCache) {
          return io.to(room_id).emit("get_messages", JSON.parse(fromCache));
        }

        const sql = `SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC`;
        const messages = await mysql.query(sql, [room_id]);

        await redisClient.set(
          `rtch_messages_${room_id}`,
          JSON.stringify(messages),
          {
            EX: 300,
          }
        );

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

        await redisClient.del(`rtch_messages_${chat_id}`);

        await redisClient.set(
          `rtch_messages_${chat_id}`,
          JSON.stringify(messages),
          {
            EX: 300,
          }
        );

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
