import express from 'express';
import {authenticateUser} from '../Middleware/authMiddleware.js';
import {authorizeRoles} from '../Middleware/roleMiddleware.js';
import { addRoute, createPlace, deletePlace, getPlaceById, getPlaces, removeRoute, updatePlace, updateRoute } from '../Controller/placeController.js';
const placeRouter = express.Router();

// Place Routes
placeRouter.post("/create",authenticateUser,authorizeRoles("admin"),createPlace);
placeRouter.get("/all",authenticateUser,authorizeRoles("admin"),getPlaces);
placeRouter.get("/get/:id",authenticateUser,authorizeRoles("admin"),getPlaceById);
placeRouter.put("/update/:id",authenticateUser,authorizeRoles("admin"),updatePlace);
placeRouter.delete("/remove/:id",authenticateUser,authorizeRoles("admin"),deletePlace);

// Route Routes
placeRouter.post("/addroute/:placeId",authenticateUser,authorizeRoles("admin"),addRoute);
placeRouter.put("/updateroute/:placeId/:routeId",authenticateUser,authorizeRoles("admin"),updateRoute);
placeRouter.delete("/removeroute/:placeId/:routeId",authenticateUser,authorizeRoles("admin"),removeRoute);
export default placeRouter;