const permissionMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check whether the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    // Check user role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this API",
      });
    }

    // Allow access
    next();
  };
};

module.exports = permissionMiddleware;
