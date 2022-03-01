import express from "express";
import { getUsers, Login, Register, Logout } from "../controllers/Users.js";
import { getEvent, SaveEvent } from "../controllers/Event.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();
 
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
 
router.post('/eventlist', getEvent);
router.post('/event', SaveEvent);

export default router;