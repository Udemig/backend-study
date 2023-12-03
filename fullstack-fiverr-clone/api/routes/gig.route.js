import express from 'express';
import {
  createGig,
  deleteGig,
  getAllGigs,
  getGig,
} from '../controllers/gig.controller.js';
import { verifyToken } from './../middlewares/jwt.js';

// 1) router oluşturma
const router = express.Router();

router.post('/', verifyToken, createGig);
router.delete('/:id', verifyToken, deleteGig);
router.get('/single/:id', verifyToken, getGig);
router.get('/', verifyToken, getAllGigs);

export default router;
