import { Router } from "express";
import {   createOrder , getCreatedOrders } from "../controller/orders"
import { isAuthenticated } from "../middlewares/auth";
const orderRouter = Router();

orderRouter.get("/all-orders/:userId" , isAuthenticated , getCreatedOrders)
orderRouter.post("/create-order"  , isAuthenticated, createOrder)



export default orderRouter