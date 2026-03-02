import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { placeOrderServices } from "../../services/placeOrderServices";

type AddOrder = {
  items: Array<{ productId: string; quantity: number }>;
};

export const addPlaceOrderHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const role = String(request.auth.credentials.role ?? "")
      .trim()
      .toLowerCase();
    if (role !== "user") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }

    const orderedBy: number = Number(request.auth.credentials.userId);
    const body = request.payload as AddOrder;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    // Service does enrichment, total calc, and stock updates
    const result = await placeOrderServices.addPlaceOrder({
      orderedBy,
      items: body.items,
    });

    return h.response({
      message: "Inserted successfully!",
      orderID: result.orderId,
      totalAmount: Number(result.totalAmount),
      itemsCount: result.itemsCount,
    }).code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
















// import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
// import { placeOrderServices } from "../../services/placeOrderServices";
// import { PlaceOrdersPayload } from "../../types/placeOrdersPayload";
// import { User } from "../../models/userTableDefinition";
// import { Product } from "../../models/productTableDefinition";
// import { ProductItems } from "../../types/productItems";

// type AddOrder = {
//   orderedBy: number;
//   items: Array<{ productId: string; quantity: number }>;
// };

// export const addPlaceOrderHandler = async (
//   request: Request,
//   h: ResponseToolkit,
// ): Promise<ResponseObject> => {
//   try {
//     const body = request.payload as {
//       items: Array<{ productId: string; quantity: number }>;
//     };
//     const role = String(request.auth.credentials.role ?? "")
//       .trim()
//       .toLowerCase();

//     if (role !== "user") {
//       return h.response({ error: "Insufficient permissions" }).code(403);
//     }

//     const orderedBy: number = Number(request.auth.credentials.userId)

//     if (
//       !Array.isArray(body.items) ||
//       body.items.length === 0
//     ) {
//       return h.response({ error: "Bad Request" }).code(400);
//     }

//     // const orderItems: {
//     //   productId: string;
//     //   prodName: string;
//     //   price: number;
//     //   quantity: number;
//     // }[] = [];

//     // for (const row of body.items) {
//     //   if (!row.productId || !row.quantity || row.quantity <= 0) {
//     //     return h.response({ error: "Invalid item in payload" }).code(400);
//     //   }

//     //   const existingProd = await Product.findOne({
//     //     where: { productId: row.productId },
//     //     attributes: ["productId", "p_name", "price"],
//     //   });
//     //   if (!existingProd) {
//     //     return h
//     //       .response({
//     //         error: `${row.productId} not found`,
//     //       })
//     //       .code(404);
//     //   }

//     //   orderItems.push({
//     //     productId: row.productId,
//     //     prodName: existingProd.p_name,
//     //     price: Number(existingProd.price),
//     //     quantity: Number(row.quantity),
//     //   });
//     // }

//     // const totalAmount = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

//     const newOrder = await placeOrderServices.addPlaceOrder({
//       items: body.items,
//       orderedBy,
//       totalAmount: 0,
//     });

//     return h
//       .response({
//         message: "Inserted successfully!",
//         orderID: newOrder.orderId,
//         totalAmount: Number(newOrder.totalAmount),
//         // itemsCount: orderItems.length,
//       })
//       .code(201);
//   } catch (err: any) {
//     console.error(err);
//     return h.response({ error: err.message || "Server error" }).code(500);
//   }
// };
