const sms = require("../service/sms.service");
const crypto = require("crypto");
const mysql = require("../utils/mysql2.helper");
const { v4: uuidv4 } = require("uuid");
const jwt = require("../utils/jwt.helper");

class authService {
  async login(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql, result, msg;
        const code = crypto.randomInt(100009, 999999);

        sql = "SELECT * FROM users WHERE phone = ?";
        result = await mysql.query(sql, [req.body.phone]);

        const set = {
          code: code,
          phone: req.body.phone,
          action: result.length ? "login" : "register",
        };

        sql = "INSERT INTO verification SET ? ON DUPLICATE KEY UPDATE ?";
        await mysql.query(sql, [set, set]);

        // msg = `Real-Time Chat dasturiga kirish uchun kod: ${code}`;
        // await sms.verify(msg, req.body.phone);

        msg = `Tasdiqlash kodi ${req.body.phone} raqamiga yuborildi`;
        resolve({ status: "success", message: msg });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async verify(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql, result, msg;
        const io = req.app.get("io");

        sql = "SELECT * FROM verification WHERE code = ?";
        result = await mysql.query(sql, [req.body.code]);

        msg = "Tasdiqlash kodi noto'g'ri";
        if (!result.length) return resolve({ status: "warning", message: msg });

        const set = { id: uuidv4(), phone: result[0].phone };
        sql = "INSERT IGNORE INTO users SET ?";
        await mysql.query(sql, [set]);

        sql = "DELETE FROM verification WHERE code = ?";
        await mysql.query(sql, [req.body.code]);

        const access = jwt.generate({ id: set.id }, "access", "1h");
        res.cookie("access", access, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60,
        });

        const refresh = jwt.generate({ id: set.id }, "refresh", "7d");
        res.cookie("refresh", refresh, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        sql = "SELECT * FROM users";
        result = await mysql.query(sql);
        io.emit("users", result);

        msg = "Real-Time Chat dasturiga xush kelibsiz";
        resolve({ status: "success", message: msg, data: set });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async logout(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        res.clearCookie("access");
        res.clearCookie("refresh");
        resolve({ status: "success", message: "Logged out" });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}

module.exports = new authService();
