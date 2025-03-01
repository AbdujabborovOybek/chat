require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const router = require("./router");
const http = require("http");
const { Server } = require("socket.io");
const socketService = require("./socket");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);
app.set("io", io);
app.use("/api/auth", router.auth);
socketService(io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
