// routes/geminiRoutes.js
import { Router } from 'express';
import { metricsSummary } from '../controllers/geminiController.js';

const router = Router();
router.get('/metrics', metricsSummary); 
export default router;
