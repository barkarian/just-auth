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
      fbGraphVersion: "v3.0",
      //scope fetch from facebook api
      scope: ["emails", "name", "user_gender", "user_friends", "photos"],
      //maps to the profileFields
      //THE CODE IS ONLY FOR REFERENCE-------------------------------------------------------------/
      //   Strategy.prototype._convertProfileFields = function(profileFields) {
      //     var map = {
      //     'id':          'id',
      //     'username':    'username',
      //     'displayName': 'name',
      //     'name':       ['last_name', 'first_name', 'middle_name'],
      //     'gender':      'gender',
      //     'profileUrl':  'link',
      //     'emails':      'email',
      //     'photos':      'picture'
      // };
      //link:https://stackoverflow.com/questions/20457849/passport-facebook-in-nodejs-profile-fields
      //----------------------------------------------------------------------------------------END/
      profileFields: [
        "emails",
        "last_name",
        "first_name",
        "gender",
        "friends",
        "picture"
      ]
    },
    async (accessToken, refreshToken, profile, done) => {
      const foundUser = await getUserByEmail(profile._json.email);
      const userNotFound = Object.entries(foundUser).length === 0;
      if (userNotFound) {
        let user = profile._json;
        //CHANGE THE CODE HERE IF YOU WANT----------------------------------/
        //add more properties to User
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
        //---------------------------------------------------------------END/
        await addOrUpdateUser(user);
        console.log({ msg: "user just added", user });
        return done(null, user);
      } else {
        const user = foundUser.Item;
        console.log({ msg: "user already exists", user });
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
      //CHANGE THE CODE HERE IF YOU WANT-------------------------------/
      //delete private to the user infos
      delete user.providers;
      //------------------------------------------------------------END/
      token = jwtGenerator(user);
      resStatus = 200;
    } else {
      resStatus = 401;
    }
    res.status(resStatus).json({ userData: user, token });
  }
);

module.exports = router;
