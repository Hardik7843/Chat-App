import express  from 'express';
import { protectedView } from "../middlewares/auth.middleware.js";
import { getUsersForSideBar, getMessages, sendMessage } from '../controllers/message.controller.js'

const router = express.Router()

router.get('/users', protectedView, getUsersForSideBar)
router.get('/:id', protectedView, getMessages )
router.post('/send/:id', protectedView, sendMessage)
export default router