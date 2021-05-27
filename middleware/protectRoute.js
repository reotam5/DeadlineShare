function protectRoute(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: "Please login first." });
  }
}

module.exports = protectRoute;
