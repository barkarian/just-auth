const router = require("express").Router();
const authorization = require("../../middleware/authorization");
require("dotenv").config();

router.get("/is-verify", authorization, async (req, res) => {
  try {
    //console.log(req.verifiedInfos);
    const userData = req.verifiedInfos;
    const token = req.header("jwt");
    //console.log({ token, userData });
    res.json({ token, userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
