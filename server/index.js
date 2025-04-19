import express from "express";
import cors from "cors";
import "dotenv/config";
import connectdb from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
// import jobRouter from "./routes/jobRoute.js";
// import postRouter from "./routes/postRoute.js";
// import companyRouter from "./routes/companyRoute.js";
// import exploreRouter from "./routes/exploreRoute.js";
// import connectionRouter from "./routes/connectionRoute.js";
// import searchRouter from "./routes/searchRoute.js";
// import messageRoute from "./routes/messageRoute.js";
// import authRoutes from "./routes/authRoute.js";
import passport from "passport";
import "./config/passport.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { populateTries } from "./config/populateTrie.js";
import { app, server } from "./config/socket.js";
import { Server } from "socket.io";
// import chatRoute from "./routes/chatRoute.js"
// import ExperienceRouter from './routes/ExperienceRoute.js'
import signupEmailRoute from './routes/signupEmailRoute.js'
// App config
const port = process.env.PORT || 8000;
connectdb();
populateTries();

const io = new Server(4000,{
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
 
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// cors({
//   origin: "*",
//   credentials: true,
// })


app.use(cookieParser());

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: { secure: false, httpOnly: true },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/user", userRouter);
 app.use("/api/send",signupEmailRoute);
// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running.");
});

// Start the server
server.listen(port, '0.0.0.0', () => {
  console.log(` Listening on port: ${port}`);
});
