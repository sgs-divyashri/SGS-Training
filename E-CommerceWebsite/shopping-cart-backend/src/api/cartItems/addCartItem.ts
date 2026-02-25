import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Op } from "sequelize";
import { User } from "../../models/userTableDefinition";
import { Product } from "../../models/productTableDefinition";
import { CartItems } from "../../models/cartItemsTableDefinition";
import { cartItemsServices } from "../../services/cartItemsServices";

export type AddCart = {
  userId: number;
  items: Array<{ productId: string; quantity: number }>;
};

// Shape of one item in JSONB array
export type CartLine = {
  productId: string;
  prodName: string;
  price: number;
  quantity: number;
};

function computeTotals(items: CartLine[]) {
  const total_quantity = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
  const totalCount = items.length;
  return { total_quantity, totalCount };
}

function mergeItems(existing: CartLine[], incoming: CartLine[]): CartLine[] {
  const map = new Map<string, CartLine>();
  for (const it of existing) {
    map.set(it.productId, { ...it, quantity: Number(it.quantity) });
  }
  for (const it of incoming) {
    const prev = map.get(it.productId);
    if (prev) {
      // increment quantity; refresh latest name/price if you want that behavior
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
}

export const addCartItemHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const role = String(request.auth?.credentials?.role ?? "")
      .trim()
      .toLowerCase();

    if (role !== "user") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }

    const userId = Number(request.auth.credentials.userId)

    const body = request.payload as AddCart;

    if (!body?.userId || !Array.isArray(body.items) || body.items.length === 0) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    if (body.userId !== userId) {
      return h.response({ error: "Only current logged in user can add item to cart." }).code(400);
    }

    // Validate user exists
    const existingUser = await User.findOne({
      where: { userId: body.userId },
      attributes: ["userId", "email"],
    });
    if (!existingUser) {
      return h
        .response({ error: `User ID: ${body.userId} not found` })
        .code(404);
    }

    for (const row of body.items) {
      if (!row.productId || typeof row.productId !== "string") {
        return h.response({ error: "Invalid item: productId is required" }).code(400);
      }
      if (row.quantity == null || Number(row.quantity) <= 0) {
        return h.response({ error: "Invalid item: quantity must be > 0" }).code(400);
      }
    }

    // Load all products in one go
    const productIds = body.items.map(i => i.productId);
    const products = await Product.findAll({
      where: { productId: { [Op.in]: productIds } },
      attributes: ["productId", "p_name", "price"],
    });

    const found = new Set(products.map(p => p.productId));
    const missing = productIds.filter(id => !found.has(id));
    if (missing.length) {
      return h
        .response({ error: `Product(s) not found: ${missing.join(", ")}` })
        .code(404);
    }

    const incomingLines: CartLine[] = body.items.map(item => {
      const prod = products.find(p => p.productId === item.productId)!;
      return {
        productId: prod.productId,
        prodName: prod.p_name,
        price: Number(prod.price),
        quantity: Number(item.quantity),
      };
    });

    // Get existing cart (one per user)
    const existingCart = await CartItems.findOne({
      where: { userId: body.userId },
    });

    if (existingCart) {
      // Merge and increment quantities
      const currentItems = (existingCart.get("items") as CartLine[]) ?? [];
      const merged = mergeItems(currentItems, incomingLines);

      const { total_quantity, totalCount } = computeTotals(merged);
      existingCart.set({
        items: merged,
        total_quantity,
        totalCount,
      });
      await existingCart.save();
    }

    const { total_quantity, totalCount } = computeTotals(incomingLines);
    const cart = await cartItemsServices.addCartItem({
      userId: body.userId,
      total_quantity,
      items: incomingLines,
      totalCount
    });

    return h
      .response({
        message: "Cart created successfully",
        cart: {
          cartId: cart.cartId,
          userId: cart.userId,
          items: cart.items,
          total_quantity: cart.total_quantity,
          totalCount: cart.totalCount,
          addedAt: cart.addedAt,
        },
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};











// import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
// import { productServices } from "../../services/productServices";
// import {
//   CartItems,
//   CartItemsPayload,
// } from "../../models/cartItemsTableDefinition";
// import { Category } from "../../models/prodCategoryTableDefinition";
// import { Product } from "../../models/productTableDefinition";
// import { Op } from "sequelize";
// import { cartItemsServices } from "../../services/cartItemsServices";
// import { User } from "../../models/userTableDefinition";

// type AddCart = {
//   userId: number;
//   items: Array<{ productId: string; quantity: number }>;
// };

// export const addCartItemHandler = async (
//   request: Request,
//   h: ResponseToolkit,
// ): Promise<ResponseObject> => {
//   try {
//     const payload = request.payload as Pick<
//       CartItemsPayload,
//       | "userId" | "items"
//       | "total_quantity"
//       | "totalCount"
//     >;

//     const role = String(request.auth.credentials.role ?? "")
//       .trim()
//       .toLowerCase();

//     if (role !== "user") {
//       return h.response({ error: "Insufficient permissions" }).code(403);
//     }

//     const body = request.payload as AddCart;

//     if (
//       !body.userId ||
//       !Array.isArray(body.items) ||
//       body.items.length === 0
//     ) {
//       return h.response({ error: "Bad Request" }).code(400);
//     }

//     const existing = await User.findOne({
//       where: {
//         userId: payload.userId,
//       },
//       attributes: ["userId", "email"],
//     });
//     if (!existing) {
//       return h
//         .response({
//           error: `User ID: ${payload.userId} not found`,
//         })
//         .code(404);
//     }

//     const orderItems: {
//       productId: string;
//       prodName: string;
//       price: number;
//       quantity: number;
//     }[] = [];

//     for (const row of body.items) {
//       if (!row.productId || !row.quantity || row.quantity <= 0) {
//         return h.response({ error: "Invalid item in payload" }).code(400);
//       }

//       const existingProd = await Product.findOne({
//         where: { productId: row.productId },
//         attributes: ["productId", "p_name", "price"],
//       });
//       if (!existingProd) {
//         return h
//           .response({
//             error: `${row.productId} not found`,
//           })
//           .code(404);
//       }

//       orderItems.push({
//         productId: row.productId,
//         prodName: existingProd.p_name,
//         price: Number(existingProd.price),
//         quantity: Number(row.quantity),
//       });
//     }

//     const existingCart = await CartItems.findOne({
//       where: { userId: payload.userId },
//     });

//     if (existingCart) {
//       await existingCart.increment("qty", { by: payload.qty ?? 1 });
//     } else {
//       await cartItemsServices.addCartItem({
//         userId: payload.userId,
//         total_quantity: payload.total_quantity,
//         items: orderItems,
//         totalCount: payload.totalCount ?? 1,
//       });
//     }

//     const dbCart = await CartItems.findAll({
//       where: { userId: user.userId },
//       order: [["addedAt", "DESC"]],
//     });

//     const newCartItem = dbCart.map((row: any) => ({
//       cartId: row.cartId,
//       prodId: row.prodId,
//       prodName: row.prodName,
//       prodDescription: row.prodDescription,
//       price: Number(row.price),
//       quantity: Number(row.qty ?? 1),
//       total_quantity: Number(row.total_quantity),
//     }));

//     return h
//       .response({
//         message: "Inserted successfully!",
//         cartItems: newCartItem,
//       })
//       .code(201);
//   } catch (err: any) {
//     console.error(err);
//     return h.response({ error: err.message || "Server error" }).code(500);
//   }
// };
