import express from 'express';
import { processChat } from '../controllers/chat.controller';

const router = express.Router();

router.post('/', processChat);

export default router;
