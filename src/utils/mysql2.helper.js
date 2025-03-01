const mysql2 = require("../config/mysql2.config");

class mysql {
  async query(query, values = null) {
    const result = await mysql2.query(query, values);
    return result[0];
  }
}

module.exports = new mysql();
