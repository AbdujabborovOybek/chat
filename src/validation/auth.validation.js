const response = require("../utils/response.helper");
const check = require("../utils/validate.helper");

class authValidation {
  // Login validation - POST: /auth/login
  async login(req, res, next) {
    try {
      const schema = {
        type: "object",
        properties: {
          phone: { type: "string" },
        },
        required: ["phone"],
        additionalProperties: false,

        errorMessage: {
          required: {
            phone: "Phone is required",
          },
          properties: {
            phone: "Phone must be a string with 10-13 characters",
          },
          additionalProperties: "Additional properties not allowed",
        },
      };

      const validate = await check(schema, req.body);
      if (!validate) return next();
      await response.warning(res, validate);
    } catch (error) {
      response.serverError(res, error.message);
    }
  }

  // Verify validation - POST: /auth/verify
  async verify(req, res, next) {
    try {
      const schema = {
        type: "object",
        properties: {
          code: { type: "string", pattern: "^[0-9]{6}$" },
        },
        required: ["code"],
        additionalProperties: false,

        errorMessage: {
          required: {
            code: "Code is required",
          },
          properties: {
            code: "Code must be a string with 6 characters",
          },
          additionalProperties: "Additional properties not allowed",
        },
      };

      const validate = await check(schema, req.body);
      if (!validate) return next();
      await response.warning(res, validate);
    } catch (error) {
      response.serverError(res, error.message);
    }
  }
}

module.exports = new authValidation();
