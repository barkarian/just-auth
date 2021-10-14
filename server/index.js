const express = require("express");
const app = express();
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

//middleware

app.use(express.json());
app.use(cors());

app.use(passport.initialize());
app.use(
  "/auth-api/facebook",
  require("./routes/authentication/facebookAuthentication")
);

app.use("/auth-api", require("./routes/authorization/jwt_authorization"));

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
