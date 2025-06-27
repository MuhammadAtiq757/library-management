// src/routes/borrow.route.ts
import express from 'express';
import { borrowBook, getBorrowSummary } from '../controllers/borrow.controller';

const router = express.Router();
router.post('/', borrowBook);
router.get('/', getBorrowSummary);

export default router; 