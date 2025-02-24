const rejectNonAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.access_level === 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { rejectNonAdmin };
