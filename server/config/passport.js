import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.emails[0].value.split("@")[0],
            password: "", // No password required for Google users
            role: "user",
            profilePicture: profile.photos[0].value,
          });
        }

        // 🔹 Save user session explicitly
        done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// 🔹 Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 🔹 Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
