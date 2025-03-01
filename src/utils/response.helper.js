class response {
  // Success response status: 200
  async success(res, msg = "success", data = null) {
    return res.status(200).json({
      status: "success",
      message: msg,
      innerData: data,
    });
  }

  // Created response status: 201
  async created(res, msg = "Created", data = null) {
    return res.status(201).json({
      status: "success",
      message: msg,
      innerData: data,
    });
  }

  // Not found response status: 404
  async notFound(res, msg = "Not found", data = null) {
    return res.status(404).json({
      status: "warning",
      message: msg,
      innerData: data,
    });
  }

  // Forbidden response status: 403
  async forbidden(res, msg = "Forbidden", data = null) {
    return res.status(403).json({
      status: "error",
      message: msg,
      innerData: data,
    });
  }

  // Unauthorized response status: 401
  async unauthorized(res, msg = "Unauthorized access", data = null) {
    return res.status(401).json({
      status: "error",
      message: msg,
      innerData: data,
    });
  }

  // Server error response status: 500
  async serverError(res, msg = "Server error", data = null) {
    return res.status(500).json({
      status: "error",
      message: msg,
      innerData: data,
    });
  }

  // Bad request response status: 400
  async warning(res, msg = "Bad request", data = null) {
    return res.status(400).json({
      status: "warning",
      message: msg,
      innerData: data,
    });
  }
}

module.exports = new response();
