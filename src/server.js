require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const router = require("./router");
const http = require("http");
const { Server } = require("socket.io");
const socketService = require("./socket");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://chat-plum-xi.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);
app.set("io", io);
app.use("/api/auth", router.auth);
socketService(io);

app.get("/ping", (req, res) => res.send("pong"));
app.use((req, res) => {
  res.status(404).json({
    status: {
      code: 404,
      message: "Not Found",
    },
    message: `The route ${req.url} does not exist`,
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
