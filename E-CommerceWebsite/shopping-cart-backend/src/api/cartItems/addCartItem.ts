import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import {
  CartItems,
  CartItemsPayload,
} from "../../models/cartItemsTableDefinition";
import { Category } from "../../models/prodCategoryTableDefinition";
import { Product } from "../../models/productTableDefinition";
import { Op } from "sequelize";
import { cartItemsServices } from "../../services/cartItemsServices";
import { User } from "../../models/userTableDefinition";

export const addCartItemHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const payload = request.payload as Pick<
      CartItemsPayload,
      | "prodId"
      | "prodName"
      | "prodDescription"
      | "price"
      | "userId"
      | "userEmail"
      | "qty"
      | "total_quantity"
      | "totalCount"
    >;

    const role = String(request.auth.credentials.role ?? "")
      .trim()
      .toLowerCase();

    if (role !== "user") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }

    if (
      !payload.prodId ||
      !payload.prodName ||
      !payload.prodDescription ||
      !payload.price ||
      !payload.userId ||
      !payload.userEmail ||
      !payload.qty
    ) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    const product = await Product.findOne({
      where: {
        productId: payload.prodId,
      },
    });

    if (!product) {
      return h.response({ error: `Product not found` }).code(404);
    }

    const user = await User.findOne({
      where: {
        userId: payload.userId,
        email: { [Op.iLike]: payload.userEmail },
      },
    });
    if (!user) {
      return h.response({ error: `User not found` }).code(404);
    }

    const existing = await CartItems.findOne({
      where: { userId: payload.userId, prodId: payload.prodId },
    });
    if (existing) {
      await existing.increment("qty", { by: payload.qty ?? 1 });
    } else {
      await cartItemsServices.addCartItem({
        prodId: payload.prodId,
        prodName: product.p_name,
        prodDescription: product.p_description,
        userId: payload.userId,
        userEmail: payload.userEmail,
        price: product.price,
        qty: payload.qty ?? 1,
        total_quantity: payload.total_quantity,
        totalCount: payload.totalCount ?? 1,
      });
    }

    const dbCart = await CartItems.findAll({
      where: { userId: user.userId },
      order: [["addedAt", "DESC"]],
    });

    const newCartItem = dbCart.map((row: any) => ({
      cartId: row.cartId,
      prodId: row.prodId,
      prodName: row.prodName,
      prodDescription: row.prodDescription,
      price: Number(row.price),
      quantity: Number(row.qty ?? 1),
      total_quantity: Number(row.total_quantity),
    }));

    return h
      .response({
        message: "Inserted successfully!",
        cartItems: newCartItem,
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
