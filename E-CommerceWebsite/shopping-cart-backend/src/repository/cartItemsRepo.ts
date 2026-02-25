import { EditCartPayload } from "../api/cartItems/editCartItem";
import {
  CartItems,
  CartItemsPayload,
} from "../models/cartItemsTableDefinition";
import generateCartItemId from "../services/generateCartItemId";
import { OrderItems } from "../models/ordersTableDefinition";

export const cartItemsRepository = {
  addCartItem: async (
    payload: Pick<
      CartItemsPayload,
      | "userId"
      | "total_quantity"
      | "items"
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
    userId: number,
    payload: EditCartPayload
  ) => {
    const cart = await CartItems.findOne({
      where: { cartId: id, userId: userId },
    });
    if (!cart) return null;

    const { productId, quantity } = payload

    const items = (cart.get("items") as OrderItems[]) ?? [];
    const idx = items.findIndex((i) => i.productId === productId);

    if (idx === -1) {
      return cart.get(); 
    }

    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      const current = items[idx]!;
      items[idx] = { ...current, quantity: current.quantity + Number(quantity) };
    }

    await cart.save();
    return cart.get();
  },

  deleteCartItem: async (id: string): Promise<string | undefined> => {
    const count = await CartItems.destroy({ where: { cartId: id } });
    return count > 0 ? id : undefined;
  },

  deleteAllCartItems: async (id: number): Promise<number | undefined> => {
    const count = await CartItems.destroy({
      where: { userId: id }
    });
    return count > 0 ? id : undefined;
  },
};