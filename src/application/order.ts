import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validation-error";
import Order from "../infrastructure/schemas/Order";
import NotFoundError from "../domain/errors/not-found-error";
import Address from "../infrastructure/schemas/Address";
import { CreateOrderDTO } from "../domain/dto/order";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = CreateOrderDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid order data");
    }

    const userId = req.auth.userId;

    const address = await Address.create({
      ...result.data.shippingAddress,
    });

    await Order.create({
      userId,
      items: result.data.items,
      addressId: address._id,
    });

    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.userId;
    const order = await Order.findById(id).populate({
      path: "addressId",
      model: "Address",
    }).populate({
      path: "items.product",
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(200).json(order); // Sending the response
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await Order.find().populate("items.product");
    res.status(200).json(data); // Sending the response
  } catch (error) {
    next(error);
  }
};
