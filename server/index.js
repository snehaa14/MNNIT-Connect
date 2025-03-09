import express from 'express';
import dotenv from 'dotenv'; 
import userRouter from './Routes/userRoutes.js';
import mongoose from "mongoose"; 
import cors from 'cors';
import signupEmailRoute from './Routes/signupEmailRoute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // If your requests include credentials like cookies, set this to true
}));


//MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONN);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
};


// Connect to MongoDB
connectDB();

app.use("/user", userRouter);
app.use("/send",signupEmailRoute);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
