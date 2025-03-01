const rt = require("express").Router();

const ac = require("./controller/auth.controller");
const av = require("./validation/auth.validation");

const auth = require("express").Router();
auth.post("/login", av.login, ac.login);
auth.post("/verify", av.verify, ac.verify);
auth.post("/logout", ac.logout);
auth.delete("/delete", ac.delete);

module.exports = { auth, rt };
