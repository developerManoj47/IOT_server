const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "ADMIN")
    return res.status(403).json({
      is_success: false,
      error_code: "FORBIDDEN_ACCESS",
      error_message: "Access restricted to administrators only.",
    });

  next();
};

export default adminMiddleware;
