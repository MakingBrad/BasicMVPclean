const rejectNonAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin === true) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { rejectNonAdmin };
