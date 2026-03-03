import { CartItems } from "../models/cartItemsTableDefinition";
import generateCartItemId from "../services/generateCartItemId";
import { Product } from "../models/productTableDefinition";
import { ProductItems } from "../types/productItems";
import { CartItemsPayload } from "../types/cartItemsPayload";

export const cartItemsRepository = {
  addCartItem: async (payload: Pick<CartItemsPayload, "productId" | "quantity">, userId: number): Promise<CartItems> => {
    const { productId, quantity = 1 } = payload;
    const existing = await CartItems.findOne({ where: { userId, productId: payload.productId } });

    const product = await Product.findOne({
      where: { productId },
      attributes: ["productId", "p_name", "p_description", "price", "qty"],
    });

    const stock = Number(product!.qty ?? 0);

    if (existing) {
      existing.quantity = Number(existing.quantity) + Number(quantity);
      existing.prodName = product!.p_name;
      existing.prodDescription = product!.p_description;
      existing.price = Number(product!.price);
      existing.total_quantity = stock

      await existing.save();
      return existing;
    }

    const newCartItem = await CartItems.create({
      cartId: generateCartItemId(),
      userId,
      productId,
      prodName: product!.p_name,
      prodDescription: product!.p_description,
      price: Number(product!.price),
      quantity: Number(quantity),
      total_quantity: stock,
    });

    return newCartItem;
  },

  getAllCartItems: async (authUserId: number) => {
    const { rows } = await CartItems.findAndCountAll({
      where: { userId: authUserId },
      order: [["addedAt", "DESC"]],
    });

    return {
      items: rows,
    };
  },

  editCartItems: async (id: string, userId: number, payload: Pick<ProductItems, "quantity" | "productId">) => {
    const cart = await CartItems.findOne({
      where: { cartId: id, userId: userId },
    });
    if (!cart) return null;

    if (payload.quantity <= 0) {
      await CartItems.destroy({ where: { cartId: id } })
    } else {
      if (payload.quantity !== undefined)
        cart.set("quantity", payload.quantity);
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