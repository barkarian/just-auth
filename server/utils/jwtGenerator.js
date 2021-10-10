const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;
