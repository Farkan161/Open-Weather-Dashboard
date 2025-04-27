import { Router } from 'express';
import apiRoutes from './api/weatherRoutes.js';
import htmlRoutes from './htmlRoutes.js';

const router = Router();

router.use('/api/weather', apiRoutes);
router.use('/', htmlRoutes);

export default router;
