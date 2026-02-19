import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { cartItemsServices } from "../../services/cartItemsServices";
import { CartItems, CartItemsPayload } from "../../models/cartItemsTableDefinition";

export const editCartItemHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const id = request.params.id;
    const userId = request.params.userId
    const payload = request.payload as Pick<CartItemsPayload, "qty">;

    const cartItems = await CartItems.findOne({ where: { cartId: id } });
    if (!cartItems) return h.response({ error: "Product not found" }).code(404);

    const cart = await cartItemsServices.editCartItems(id, userId, payload);

    return h
      .response({
        message: "Edited Product successfully",
        cart: cart,
      })
      .code(200);
  } catch (err: any) {
    console.error("ERROR:", err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
