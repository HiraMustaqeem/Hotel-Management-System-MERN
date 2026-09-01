// middleware/role.middleware.js

module.exports = (...allowedRoles) => {

  return (req, res, next) => {

    try {
      // check if user exists in request (from auth middleware)
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          msg: "Unauthorized: No user found"
        });
      }

      // check role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          msg: "Access Denied: Insufficient permissions"
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        msg: "Role middleware error",
        error: error.message
      });
    }
  };
};