import { CartItems } from "../models/cartItemsTableDefinition";
import { CartItemsPayload } from "../types/cartItemsPayload";
import { cartItemsRepository } from "../repository/cartItemsRepo";
import { ProductItems } from "../types/productItems";

export const cartItemsServices = {
  addCartItem: async (
    payload: Pick<
      CartItemsPayload,
      | "userId"
      // | "total_quantity"
      | "items"
      // | "totalCount"
    >,
  ): Promise<CartItems> => {
    const cart = await cartItemsRepository.addCartItem(payload);
    return cart;
  },

  getAllCartItems: async (authUserId: number) => {
    const cartItems = await cartItemsRepository.getAllCartItems(authUserId);
    return cartItems;
  },

  editCartItems: async (
    id: string,
    userId: number,
    payload: Pick<ProductItems, "productId" | "quantity">,
  ) => {
    const cartItems = await cartItemsRepository.editCartItems(id, userId, payload);
    return cartItems;
  },

  deleteCartItem: async (id: string): Promise<string | undefined> => {
    return await cartItemsRepository.deleteCartItem(id);
  },

  deleteAllCartItems: async (id: number): Promise<number | undefined> => {
    return await cartItemsRepository.deleteAllCartItems(id);
  },
};
