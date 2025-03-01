const response = require("../utils/response.helper");
const authService = require("../service/auth.service");

class authController {
  async login(req, res) {
    try {
      const result = await authService.login(req, res);
      response[result.status](res, result);
    } catch (error) {
      response.serverError(res, "Internal server error");
    }
  }

  async verify(req, res) {
    try {
      const result = await authService.verify(req, res);
      response[result.status](res, result);
    } catch (error) {
      response.serverError(res, "Internal server error");
    }
  }

  async logout(req, res) {
    try {
      const result = await authService.logout(req, res);
      response[result.status](res, result);
    } catch (error) {
      response.serverError(res, "Internal server error");
    }
  }

  async delete(req, res) {}
}

module.exports = new authController();
