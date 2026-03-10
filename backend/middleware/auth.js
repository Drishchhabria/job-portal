const jwt = require("jsonwebtoken");

/**
 * Middleware: verify Admin JWT token from Authorization header.
 * Usage: router.post("/", requireAdmin, handler)
 */
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No authorization token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

module.exports = { requireAdmin };
