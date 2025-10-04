import express from 'express';
import { getAdminStats } from '../controller/statsController.js';

const statsRouter = express.Router();

// Route to get all admin statistics
statsRouter.get('/', getAdminStats);

export default statsRouter;
