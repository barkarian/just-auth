const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("jwt");
    //console.log(jwtToken);
    //if user doesn't have a token
    if (!jwtToken) {
      return res
        .status(403)
        .json({ failureMsgData: "serverMsg:You don't have a jwt token" });
    }
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.verifiedInfos = payload;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ failureMsgData: "serverMsg:You are not authorized" });
  }
};
