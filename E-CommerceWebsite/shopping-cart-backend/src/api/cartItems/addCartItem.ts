import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { Op } from "sequelize";
import { User } from "../../models/userTableDefinition";
import { Product } from "../../models/productTableDefinition";
import { CartItems } from "../../models/cartItemsTableDefinition";
import { cartItemsServices } from "../../services/cartItemsServices";

export type AddCart = {
  userId: number;
  items: Array<{ productId: string; quantity: number }>;
};

export type CartLine = {
  productId: string;
  prodName: string;
  price: number;
  quantity: number;
};

const computeTotals = (items: CartLine[]) => ({
  total_quantity: items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
  totalCount: items.length,
});

const mergeItems = (existing: CartLine[], incoming: CartLine[]) => {
  const map = new Map<string, CartLine>();
  for (const it of existing) map.set(it.productId, { ...it, quantity: Number(it.quantity) });
  for (const it of incoming) {
    const prev = map.get(it.productId);
    if (prev) {
      map.set(it.productId, {
        ...prev,
        prodName: it.prodName ?? prev.prodName,
        price: it.price ?? prev.price,
        quantity: Number(prev.quantity) + Number(it.quantity),
      });
    } else {
      map.set(it.productId, { ...it, quantity: Number(it.quantity) });
    }
  }
  return Array.from(map.values());
};

export const addCartItemHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    // Auth check
    const role = String(request.auth?.credentials?.role ?? "").trim().toLowerCase();
    const authUserId = Number(request.auth?.credentials?.userId);
    if (role !== "user") return h.response({ error: "Insufficient permissions" }).code(403);

    // Input
    const body = request.payload as AddCart;
    if (!body?.userId || !Array.isArray(body.items) || body.items.length === 0) {
      return h.response({ error: "Bad Request" }).code(400);
    }
    if (body.userId !== authUserId) {
      return h.response({ error: "Only the logged-in user can modify this cart." }).code(400);
    }
    for (const it of body.items) {
      if (!it.productId || typeof it.productId !== "string") {
        return h.response({ error: "Invalid item: productId is required" }).code(400);
      }
      if (it.quantity == null || Number(it.quantity) <= 0) {
        return h.response({ error: "Invalid item: quantity must be > 0" }).code(400);
      }
    }

    // Ensure user exists (cheap)
    const existingUser = await User.findOne({
      where: { userId: body.userId },
      attributes: ["userId"],
    });
    if (!existingUser) return h.response({ error: `User ${body.userId} not found` }).code(404);

    // Load product snapshots once
    const productIds = body.items.map(i => i.productId);
    const products = await Product.findAll({
      where: { productId: { [Op.in]: productIds } },
      attributes: ["productId", "p_name", "price"],
    });
    const found = new Set(products.map(p => p.productId));
    const missing = productIds.filter(id => !found.has(id));
    if (missing.length) {
      return h.response({ error: `Product(s) not found: ${missing.join(", ")}` }).code(404);
    }

    const incoming: CartLine[] = body.items.map(it => {
      const p = products.find(pp => pp.productId === it.productId)!;
      return {
        productId: p.productId,
        prodName: p.p_name,
        price: Number(p.price),
        quantity: Number(it.quantity),
      };
    });

    // Upsert: merge-if-exists, otherwise create
    const existingCart = await CartItems.findOne({ where: { userId: body.userId } });

    if (existingCart) {
      const current = (existingCart.get("items") as unknown as CartLine[]) ?? [];
      const items = mergeItems(current, incoming);
      const { total_quantity, totalCount } = computeTotals(items);

      existingCart.set({ items, total_quantity, totalCount });
      await existingCart.save();

      return h.response({
        message: "Cart updated",
        cart: {
          cartId: existingCart.cartId,
          userId: existingCart.userId,
          items: existingCart.items,
          total_quantity: existingCart.total_quantity,
          totalCount: existingCart.totalCount,
          addedAt: existingCart.addedAt,
        },
      }).code(200);
    }

    // Create
    const { total_quantity, totalCount } = computeTotals(incoming);
    const cart = await cartItemsServices.addCartItem({
      userId: body.userId,
      items: incoming,
      total_quantity,
      totalCount,
    });

    return h.response({
      message: "Cart created",
      cart: {
        cartId: cart.cartId,
        userId: cart.userId,
        items: cart.items,
        total_quantity: cart.total_quantity,
        totalCount: cart.totalCount,
        addedAt: cart.addedAt,
      },
    }).code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};

