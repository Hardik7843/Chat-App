import express from 'express'
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import {protectedView} from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.put('/updateProfile', protectedView, updateProfile)
router.get("/check", protectedView, checkAuth)

export default router;