import express from "express";
import { getDeliveryReport, getSalesReport } from "../Controller/ReportController.js";


const ReportRoute = express.Router();
ReportRoute.get("/sales", getSalesReport);
ReportRoute.get("/delivery", getDeliveryReport);
export default ReportRoute;