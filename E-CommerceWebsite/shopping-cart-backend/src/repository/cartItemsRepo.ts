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
      attributes: ["productId", "p_name", "p_description", "price", "total_quantity"],
    });

    if (existing) {
      existing.quantity = Number(existing.quantity) + Number(quantity);

      await existing.save();
      return existing;
    }

    const newCartItem = await CartItems.create({
      cartId: generateCartItemId(),
      userId,
      productId,
      quantity: Number(quantity),
    });

    return newCartItem;
  },

  getAllCartItems: async (authUserId: number) => {
    const { rows } = await CartItems.findAndCountAll({
      where: { userId: authUserId },
      order: [["addedAt", "DESC"]],
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ["p_name", "p_description", "price", "total_quantity"],
          required: true
        }
      ]
    });

    return {
      items: rows,
    };
  },

  editCartItems: async (id: string, adminId: number, payload: Pick<ProductItems, "quantity" | "productId">) => {
    const cart = await CartItems.findOne({
      where: { cartId: id, userId: adminId },
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