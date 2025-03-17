const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../app/models/Users");
const jwt = require('jsonwebtoken');

function initializeGG(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.WEB_URL ? process.env.WEB_URL + "auth/google/callback" : "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await Users.findOne({ googleId: profile.id });
            if (!user) {
                user = await Users.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    watchedVideos: [1],
                    finishedSteps: [1]
                });
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return done(null, { user, token });
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.user._id); // Only serialize the user ID
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Users.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    });
}

module.exports = initializeGG;