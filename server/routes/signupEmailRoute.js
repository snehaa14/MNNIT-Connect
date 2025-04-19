import express from 'express';
import { signupEmail } from '../controllers/signupEmailController.js'; 

const signupEmailRoute = express.Router();
console.log("inside signup Email Route");
signupEmailRoute.post('/verification-code', signupEmail);

export default signupEmailRoute;
