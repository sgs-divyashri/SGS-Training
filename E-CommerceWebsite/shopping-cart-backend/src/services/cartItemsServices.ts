import {
  productRepository,
  ProductFilterSpec,
  PageSpec,
} from "../repository/productRepo";
import { Product, ProductPayload } from "../models/productTableDefinition";
import { Category } from "../models/prodCategoryTableDefinition";
import {
  CartItems,
  CartItemsPayload,
} from "../models/cartItemsTableDefinition";
import { cartItemsRepository } from "../repository/cartItemsRepo";
import { EditCartPayload } from "../api/cartItems/editCartItem";

export const cartItemsServices = {
  addCartItem: async (
    payload: Pick<
      CartItemsPayload,
      | "userId"
      | "total_quantity"
      | "items"
      | "totalCount"
    >,
  ): Promise<CartItems> => {
    const cart = await cartItemsRepository.addCartItem(payload);
    return cart;
  },

  getAllCartItems: async () => {
    const cartItems = await cartItemsRepository.getAllCartItems();
    return cartItems;
  },

  editCartItems: async (
    id: string,
    userId: number,
    payload: EditCartPayload,
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
