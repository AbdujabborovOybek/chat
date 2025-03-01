const jwt = require("jsonwebtoken");
const access = process.env.JWT_SECRET_ACCESS;
const refresh = process.env.JWT_SECRET_REFRESH;
const key = process.env.JWT_SECRET_KEY;

class jwtHelper {
  // generate a JWT token
  async generate(payload, type, exp) {
    return new Promise(async (resolve, reject) => {
      try {
        if (type === "access") {
          const token = jwt.sign(payload, access, {
            expiresIn: exp,
            algorithm: "HS256",
          });
          return resolve(token);
        }

        if (type === "refresh") {
          const token = jwt.sign(payload, refresh, {
            expiresIn: exp,
            algorithm: "HS256",
          });
          return resolve(token);
        }

        if (type === "token") {
          const token = jwt.sign(payload, key, {
            expiresIn: exp,
            algorithm: "HS256",
          });
          return resolve(token);
        }

        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }

  // verify a JWT token
  async verify(token, type) {
    return new Promise(async (resolve, reject) => {
      try {
        if (type === "access") {
          const decoded = jwt.verify(token, access);
          return resolve(decoded);
        }

        if (type === "refresh") {
          const decoded = jwt.verify(token, refresh);
          return resolve(decoded);
        }

        if (type === "token") {
          const decoded = jwt.verify(token, key);
          return resolve(decoded);
        }

        resolve(null);
      } catch (error) {
        resolve(null);
      }
    });
  }
}

module.exports = new jwtHelper();
