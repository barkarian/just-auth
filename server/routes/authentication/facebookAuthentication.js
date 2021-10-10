const router = require("express").Router();
const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const { getUserByEmail, addOrUpdateUser } = require("../../databases/dynamoDb");
const jwtGenerator = require("../../utils/jwtGenerator");
require("dotenv").config();

passport.use(
  "facebook-token",
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      fbGraphVersion: "v3.0"
    },
    async (accessToken, refreshToken, profile, done) => {
      //get email
      const email = profile.emails[0].value;
      //save new data to database
      const foundUser = await getUserByEmail(email);
      let user;
      if (!(foundUser == {})) {
        //NEW USER
        //delete some properties from profile and save it to variable user
        let { _json, _raw, emails, provider, id, ...user } = profile;
        //add more properties to User
        user.email = email;
        user.profileStatus = {
          admin: false,
          premium_user: false,
          regular_user: true,
          emailVerification: false,
          phoneNumberVerification: false,
          partiallyActive: true,
          completeProfile: false
        };
        user.providers = [
          { provider: "facebook", id: profile.id, accessToken: accessToken }
        ];
        //add user to the database
        await addOrUpdateUser(user);
        return done(null, user);
      } else {
        let user = foundUser;
        return done(null, user);
      }
    }
  )
);

router.get(
  "/token",
  passport.authenticate("facebook-token", {
    session: false
  }),
  function (req, res) {
    let user = req.user;
    let token;
    let resStatus;
    if (user) {
      delete user.providers;
      token = jwtGenerator(user);
      resStatus = 200;
    } else {
      resStatus = 401;
    }
    res.status(resStatus).json({ userData: user, token });
  }
);

module.exports = router;
