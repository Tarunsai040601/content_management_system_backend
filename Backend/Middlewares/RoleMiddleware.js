const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "User not authenticated",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. You don't have permission.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Role authorization failed",
        error: error.message,
      });
    }
  };
};

module.exports = roleMiddleware;
