import express from "express";
import { createOrder, getOrder, getOrders } from "../application/order";
import { isAuthenticated } from "./middleware/authentication-middleware";

export const orderRouter = express.Router();

orderRouter
.route("/")
.get(isAuthenticated, getOrders)
.post(isAuthenticated, createOrder);

orderRouter.route("/:id").get(isAuthenticated, getOrder);


