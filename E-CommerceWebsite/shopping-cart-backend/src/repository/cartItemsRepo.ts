import {
  CartItems,
  CartItemsPayload,
} from "../models/cartItemsTableDefinition";
import { Product, ProductPayload } from "../models/productTableDefinition";
import generateCartItemId from "../services/generateCartItemId";
import generateSimpleId from "../services/generateProductId";

export const cartItemsRepository = {
  addCartItem: async (
    payload: Pick<
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
    >,
  ): Promise<CartItems> => {
    const cart = await CartItems.create({
      ...payload,
      cartId: generateCartItemId(),
    });
    return cart;
  },

  getAllCartItems: async () => {
    const { rows } = await CartItems.findAndCountAll({
      //   attributes: { exclude: ["createdAt"] },
      order: [["addedAt", "DESC"]],
    });

    return {
      items: rows,
    };
  },

  editCartItems: async (
    id: string,
    userId: string,
    payload: Pick<Partial<CartItemsPayload>, "qty">,
  ) => {
    const cart = await CartItems.findOne({
      where: { cartId: id, userId: userId },
    });
    if (!cart) return null;

    if (payload.qty !== undefined) cart.set("qty", payload.qty);

    await cart.save();
    return cart.get();
  },

  deleteCartItem: async (id: string): Promise<string | undefined> => {
    const count = await CartItems.destroy({ where: { cartId: id } });
    return count > 0 ? id : undefined;
  },

  deleteAllCartItems: async (id: number): Promise<number | undefined> => {
    const count = await CartItems.destroy({
      where: { userId: id}
    });
    return count > 0 ? id: undefined;
  },
};