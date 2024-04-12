import { Router } from "express";
import {   createOrder , getCreatedOrders } from "../controller/orders"
const orderRouter = Router();

orderRouter.get("/all-orders/:userId" , getCreatedOrders)
orderRouter.post("/create-order" , createOrder)



export default orderRouter