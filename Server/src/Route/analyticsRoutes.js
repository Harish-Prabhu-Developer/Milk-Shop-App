import express from 'express';
import { getDashboardSummary } from '../Controller/DashboardController.js';
import { authenticateUser } from '../Middleware/authMiddleware.js';
import { authorizeRoles } from '../Middleware/roleMiddleware.js';

const AnalyticsRoute=express.Router();

AnalyticsRoute.get('/dashboard',getDashboardSummary);


export default AnalyticsRoute;