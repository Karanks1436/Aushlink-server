const jwt = require("jsonwebtoken");

function validateTokenn2(req, res, next) {
  const full_token = req.headers['authorization'];
  if (!full_token) return res.json({ status: false, msg: "Token not provided" });

  const [bearer, token] = full_token.split(" ");
  if (bearer !== "Bearer" || !token) return res.json({ status: false, msg: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.SEC_KEY);
    req.user = decoded; // optional
    next();
  } catch (err) {
    res.json({ status: false, msg: "Invalid or expired token" });
  }
}

module.exports = { validateTokenn2 };
