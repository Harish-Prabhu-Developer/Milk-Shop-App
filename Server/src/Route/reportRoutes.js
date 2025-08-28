import express from "express";
import { getDeliveryReport, getReportData, getSalesReport } from "../Controller/ReportController.js";


const ReportRoute = express.Router();
ReportRoute.get("/sales", getSalesReport);
ReportRoute.get("/delivery", getDeliveryReport);
ReportRoute.get("/report",getReportData);
export default ReportRoute;