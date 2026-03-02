import { AddCart } from "../api/cartItems/addCartItem";
import { CartItems } from "../models/cartItemsTableDefinition";
import generateCartItemId from "../services/generateCartItemId";
import { Product } from "../models/productTableDefinition";
import { ProductItems } from "../types/productItems";

export const cartItemsRepository = {
  addCartItem: async (payload: AddCart): Promise<CartItems> => {
    const { userId, items } = payload;
    const existingCart = await CartItems.findOne({ where: { userId } });

    const productIds = items.map(i => i.productId);
    const products = await Product.findAll({
      where: { productId: productIds },
      attributes: ["productId", "p_name", "p_description", "price"]
    });

    if (products.length !== items.length) {
      throw new Error("One or more productIds not found");
    }

    const enriched: ProductItems[] = items.map(it => {
      const p = products.find(p => p.productId === it.productId)!;
      return {
        productId: it.productId,
        prodName: p.p_name,
        prodDescription: p.p_description,
        price: Number(p.price),
        quantity: 1,
      };
    });


    if (!existingCart) {
      const fresh: ProductItems[] = [];
      for (const inc of enriched) {
        const match = fresh.find(i => i.productId === inc.productId);
        if (match) {
          match.quantity += 1;
        } else {
          fresh.push({ ...inc });
        }
      }

      return await CartItems.create({
        cartId: generateCartItemId(),
        userId,
        items: fresh,
      });
    }

    const updatedItems: ProductItems[] = Array.isArray(existingCart.items)
      ? [...(existingCart.items as ProductItems[])]
      : [];


    for (const inc of enriched) {
      const found = updatedItems.find(i => i.productId === inc.productId);

      if (found) {
        const prevQty = Number(found.quantity || 0);
        found.quantity = prevQty + 1;
        if (inc.prodName != null) found.prodName = inc.prodName;
        if (inc.prodDescription != null) found.prodDescription = inc.prodDescription;
        if (inc.price != null) found.price = inc.price;
      } else {
        updatedItems.push({ ...inc, quantity: 1 });
      }
    }


    // existingCart.set('items', updatedItems);
    // await existingCart.save()
    await existingCart.update({ items: updatedItems }, { returning: true });
    await existingCart.reload();
    // await existingCart.update({ items: updatedItems });
    return existingCart;
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

  editCartItems: async (
    id: string,
    userId: number,
    payload: Pick<ProductItems, "quantity" | "productId">
  ) => {
    const cart = await CartItems.findOne({
      where: { cartId: id, userId: userId },
    });
    if (!cart) return null;

    const { productId, quantity } = payload

    const items = (cart.get("items") as ProductItems[]) ?? [];
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