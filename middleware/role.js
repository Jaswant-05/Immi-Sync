const roleMiddleware = (...roles) => {
    return (req, res, next) => {
      const userRole = req.user_role;
  
      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }
  
      next();
    };
  };
  
  module.exports = { roleMiddleware };
  