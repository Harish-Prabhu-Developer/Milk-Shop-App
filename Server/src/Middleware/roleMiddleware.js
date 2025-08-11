export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      console.log("User Role:", req.user.role);  // Debug log
      console.log("Allowed Roles:", allowedRoles);  // Debug log
  
      if (!req.user || !allowedRoles.includes(req.user.role.trim())) {
        return res.status(403).json({
          status: "fail",
          msg: "Access denied. Insufficient permissions.",
        });
      }
      next();
    };
  };
  