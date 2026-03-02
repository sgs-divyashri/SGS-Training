import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { cartItemsServices } from "../../services/cartItemsServices";

export type AddCart = {
  userId: number;
  items: Array<{ productId: string; quantity: number }>;
};

export const addCartItemHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    // Auth
    const role = String(request.auth?.credentials?.role ?? "").trim().toLowerCase();
    const authUserId = Number(request.auth?.credentials?.userId);
    if (role !== "user") return h.response({ error: "Insufficient permissions" }).code(403);

    // Validate payload (allow 1 or many)
    const body = request.payload as AddCart
    if (!body?.userId || !Array.isArray(body.items) || body.items.length === 0) {
      return h.response({ error: "Bad Request" }).code(400);
    }
    if (body.userId !== authUserId) {
      return h.response({ error: "Only the logged-in user can modify this cart." }).code(400);
    }

//     for (const it of body.items) {
//       if (!it.productId || typeof it.productId !== "string") {
//         return h.response({ error: "Invalid item: productId is required" }).code(400);
//       }
//       if (it.quantity == null || Number(it.quantity) <= 0) {
//         return h.response({ error: "Invalid item: quantity must be > 0" }).code(400);
//       }
//     }

//     const computeTotals = (items: ProductItems[]) => ({
//       // total_quantity: items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
//       totalCount: items.length
//     });

// const mergeItems = (existing: ProductItems[], incoming: ProductItems[]) => {
//   const map = new Map<string, ProductItems>();
//   for (const it of existing) {
//     map.set(it.productId, { ...it, quantity: Number(it.quantity || 0) });
//   }
//   for (const it of incoming) {
//     const prev = map.get(it.productId);
//     if (prev) {
//       map.set(it.productId, {
//         productId: prev.productId,
//         prodName: it.prodName ?? prev.prodName,
//         price: Number(it.price ?? prev.price),
//         total_quantity: Number(it.total_quantity ?? prev.total_quantity ?? 0),
//         quantity: Number(prev.quantity) + Number(it.quantity || 0), // SUM
//       });
//     } else {
//       map.set(it.productId, {
//         productId: it.productId,
//         prodName: it.prodName,
//         price: Number(it.price),
//         total_quantity: Number(it.total_quantity ?? 0),
//         quantity: Number(it.quantity || 0),
//       });
//     }
//   }
//   return Array.from(map.values());
// };

// //     // Ensure user exists
//     const existingUser = await User.findOne({ where: { userId: body.userId }, attributes: ["userId"] });
//     if (!existingUser) return h.response({ error: `User ${body.userId} not found` }).code(404);

//     // Load all products (IN clause) and include qty → stock
//     const productIds = body.items.map(i => i.productId);
//     const products = await Product.findAll({
//       where: { productId: { [Op.in]: productIds } },
//       attributes: ["productId", "p_name", "price", "qty"], // include qty!
//     });

//     const found = new Set(products.map(p => p.productId));
//     const missing = productIds.filter(id => !found.has(id));
//     if (missing.length) {
//       return h.response({ error: `Product(s) not found: ${missing.join(", ")}` }).code(404);
//     }

//     // Build incoming array enriched with price/name/stock
//     const incoming: ProductItems[] = body.items.map(it => {
//       const p = products.find(pp => pp.productId === it.productId)!;
//       return {
//         productId: p.productId,
//         prodName: p.p_name,
//         price: Number(p.price),
//         quantity: Number(it.quantity),
//         total_quantity: Number(p.qty ?? 0), // expose as "available quantity"
//       };
//     });

//     // Load user's cart
//     const existingCart = await CartItems.findOne({ where: { userId: body.userId } });

//     if (existingCart) {
//       const current = (existingCart.get("items") as unknown as ProductItems[]) ?? [];
//       // ✅ Merge (append); do NOT overwrite
//       const items = mergeItems(current, incoming);
//       const { total_quantity, totalCount } = computeTotals(items);

//       existingCart.set({ items, total_quantity, totalCount });
//       await existingCart.save();

//       return h.response({
//         message: "Cart updated",
//         cart: {
//           cartId: existingCart.cartId,
//           userId: existingCart.userId,
//           items: existingCart.items,
//           total_quantity: existingCart.total_quantity,
//           totalCount: existingCart.totalCount,
//           addedAt: existingCart.addedAt,
//         },
//       }).code(200);
//     }

//     // No cart yet → create a new row with *incoming* items
//     const { total_quantity, totalCount } = computeTotals(incoming);
    const cart = await cartItemsServices.addCartItem(body);

    return h.response({
      message: "Cart created",
      cart: {
        cartId: cart.cartId,
        userId: cart.userId,
        items: cart.items,
        addedAt: cart.addedAt,
      },
    }).code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};



// import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
// import { CartItems } from "../../models/cartItemsTableDefinition";
// import { Product } from "../../models/productTableDefinition";
// import { cartItemsServices } from "../../services/cartItemsServices";
// import { User } from "../../models/userTableDefinition";
// import { CartItemsPayload } from "../../types/cartItemsPayload";

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












// import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
// import { Op } from "sequelize";
// import { User } from "../../models/userTableDefinition";
// import { Product } from "../../models/productTableDefinition";
// import { CartItems } from "../../models/cartItemsTableDefinition";
// import { cartItemsServices } from "../../services/cartItemsServices";
// import { ProductItems } from "../../types/productItems";

// export const addCartItemHandler = async (
//   request: Request,
//   h: ResponseToolkit,
// ): Promise<ResponseObject> => {
//   try {
//     const role = String(request.auth?.credentials?.role ?? "").trim().toLowerCase();
//     const authUserId = Number(request.auth?.credentials?.userId);
//     if (role !== "user") return h.response({ error: "Insufficient permissions" }).code(403);

//     const body = request.payload as {
//       userId: number;
//       items: Array<{ productId: string; quantity: number }>;
//     };

//     // exactly 1 item
//     if (!body?.userId || !Array.isArray(body.items) || body.items.length !== 1) {
//       return h.response({ error: "Bad Request: exactly one item must be provided" }).code(400);
//     }
//     if (body.userId !== authUserId) {
//       return h.response({ error: "Only the logged-in user can modify this cart." }).code(400);
//     }

//     const only = body.items[0]!;
//     if (!only.productId || typeof only.productId !== "string") {
//       return h.response({ error: "Invalid item: productId is required" }).code(400);
//     }
//     if (only.quantity == null || Number(only.quantity) <= 0) {
//       return h.response({ error: "Invalid item: quantity must be > 0" }).code(400);
//     }

//     const existingUser = await User.findOne({
//       where: { userId: body.userId },
//       attributes: ["userId"],
//     });
//     if (!existingUser) return h.response({ error: `User ${body.userId} not found` }).code(404);

//     // include qty so we can attach stock
//     const product = await Product.findOne({
//       where: { productId: only.productId },
//       attributes: ["productId", "p_name", "price", "qty"],
//     });
//     if (!product) return h.response({ error: `Product not found: ${only.productId}` }).code(404);

//     // build single item
//     const oneItem: ProductItems = {
//       productId: product.productId,
//       prodName: product.p_name,
//       price: Number(product.price),
//       quantity: Number(only.quantity),
//     };

//     // look for this user's cart
//     const existingCart = await CartItems.findOne({ where: { userId: body.userId } });
//     const totalCount = 1;
//     const total_quantity = Number(product.qty ?? 0)
//     // const total_quantity = oneItem.quantity; // if you keep this field

//     if (existingCart) {
//       // OVERWRITE: keep only this single item
//       existingCart.set({
//         items: [oneItem],
//         totalCount,
//         total_quantity,
//       });
//       await existingCart.save();

//       return h.response({
//         message: "Cart updated",
//         cart: {
//           cartId: existingCart.cartId,
//           userId: existingCart.userId,
//           items: existingCart.items,          // <- exactly one item
//           total_quantity: existingCart.total_quantity,
//           totalCount: existingCart.totalCount,
//           addedAt: existingCart.addedAt,
//         },
//       }).code(200);
//     }

//     // create new cart with the single item
//     const cart = await cartItemsServices.addCartItem({
//       userId: body.userId,
//       items: [oneItem],       // <- exactly one item
//       total_quantity,
//       totalCount,
//     });

//     return h.response({
//       message: "Cart created",
//       cart: {
//         cartId: cart.cartId,
//         userId: cart.userId,
//         items: cart.items,     // <- exactly one item
//         total_quantity: cart.total_quantity,
//         totalCount: cart.totalCount,
//         addedAt: cart.addedAt,
//       },
//     }).code(201);
//   } catch (err: any) {
//     console.error(err);
//     return h.response({ error: err.message || "Server error" }).code(500);
//   }
// };











// // import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
// // import { Op } from "sequelize";
// // import { User } from "../../models/userTableDefinition";
// // import { Product } from "../../models/productTableDefinition";
// // import { CartItems } from "../../models/cartItemsTableDefinition";
// // import { cartItemsServices } from "../../services/cartItemsServices";
// // import { ProductItems } from "../../types/productItems";

// // const computeTotals = (items: ProductItems[]) => ({
// //   total_quantity: items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
// //   totalCount: items.length,
// // });

// // const mergeItems = (existing: ProductItems[], incoming: ProductItems[]) => {
// //   const map = new Map<string, ProductItems>();
// //   for (const it of existing) map.set(it.productId, { ...it, quantity: Number(it.quantity) });
// //   for (const it of incoming) {
// //     const prev = map.get(it.productId);
// //     if (prev) {
// //       map.set(it.productId, {
// //         ...prev,
// //         prodName: it.prodName ?? prev.prodName,
// //         price: it.price ?? prev.price,
// //         quantity: Number(prev.quantity) + Number(it.quantity),
// //       });
// //     } else {
// //       map.set(it.productId, { ...it, quantity: Number(it.quantity) });
// //     }
// //   }
// //   return Array.from(map.values());
// // };

// // export const addCartItemHandler = async (
// //   request: Request,
// //   h: ResponseToolkit,
// // ): Promise<ResponseObject> => {
// //   try {
// //     const role = String(request.auth?.credentials?.role ?? "").trim().toLowerCase();
// //     const authUserId = Number(request.auth?.credentials?.userId);
// //     if (role !== "user") return h.response({ error: "Insufficient permissions" }).code(403);

// //     const body = request.payload as {
// //       userId: number;
// //       items: Array<{ productId: string; quantity: number }>;
// //     };
    
// //     if (!body?.userId || !Array.isArray(body.items) || body.items.length !== 1) {
// //       return h.response({ error: "Bad Request" }).code(400);
// //     }
// //     if (body.userId !== authUserId) {
// //       return h.response({ error: "Only the logged-in user can modify this cart." }).code(400);
// //     }
// //     for (const it of body.items) {
// //       if (!it.productId || typeof it.productId !== "string") {
// //         return h.response({ error: "Invalid item: productId is required" }).code(400);
// //       }
// //       if (it.quantity == null || Number(it.quantity) <= 0) {
// //         return h.response({ error: "Invalid item: quantity must be > 0" }).code(400);
// //       }
// //     }

// //     const existingUser = await User.findOne({
// //       where: { userId: body.userId },
// //       attributes: ["userId"],
// //     });
// //     if (!existingUser) return h.response({ error: `User ${body.userId} not found` }).code(404);

// //     const productIds = body.items.map(i => i.productId);
// //     const products = await Product.findAll({
// //       where: { productId: { [Op.in]: productIds } },
// //       attributes: ["productId", "p_name", "price"],
// //     });
// //     const found = new Set(products.map(p => p.productId));
// //     const missing = productIds.filter(id => !found.has(id));
// //     if (missing.length) {
// //       return h.response({ error: `Product(s) not found: ${missing.join(", ")}` }).code(404);
// //     }

// //     const incoming: ProductItems[] = body.items.map(it => {
// //       const p = products.find(pp => pp.productId === it.productId)!;
// //       return {
// //         productId: p.productId,
// //         prodName: p.p_name,
// //         price: Number(p.price),
// //         quantity: Number(it.quantity),
// //         stock: Number(p.qty ?? 0),
// //       };
// //     });

// //     const existingCart = await CartItems.findOne({ where: { userId: body.userId } });

// //     if (existingCart) {
// //       const current = (existingCart.get("items") as unknown as ProductItems[]) ?? [];
// //       const items = mergeItems(current, incoming);
// //       const { total_quantity, totalCount } = computeTotals(items);

// //       existingCart.set({ items, total_quantity, totalCount });
// //       await existingCart.save();

// //       return h.response({
// //         message: "Cart updated",
// //         cart: {
// //           cartId: existingCart.cartId,
// //           userId: existingCart.userId,
// //           items: existingCart.items,
// //           total_quantity: existingCart.total_quantity,
// //           totalCount: existingCart.totalCount,
// //           addedAt: existingCart.addedAt,
// //         },
// //       }).code(200);
// //     }

// //     const { total_quantity, totalCount } = computeTotals(incoming);
// //     const cart = await cartItemsServices.addCartItem({
// //       userId: body.userId,
// //       items: incoming,
// //       total_quantity,
// //       totalCount,
// //     });

// //     return h.response({
// //       message: "Cart created",
// //       cart: {
// //         cartId: cart.cartId,
// //         userId: cart.userId,
// //         items: cart.items,
// //         total_quantity: cart.total_quantity,
// //         totalCount: cart.totalCount,
// //         addedAt: cart.addedAt,
// //       },
// //     }).code(201);
// //   } catch (err: any) {
// //     console.error(err);
// //     return h.response({ error: err.message || "Server error" }).code(500);
// //   }
// // };

