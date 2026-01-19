import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { ProductPayload } from "../../models/productTableDefinition";

export const addProductHandler = async (
  request: Request,
  h: ResponseToolkit
): Promise<ResponseObject> => {
  try {
    const payload = request.payload as Pick<
      ProductPayload,
      "p_name" | "p_description" | "prod_category" | "orderedBy" | "price"
    >;

    if (
      !payload.p_name ||
      !payload.p_description ||
      !payload.prod_category ||
      !payload.orderedBy ||
      !payload.price
    ) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    const newUser = await productServices.createProduct({
      p_name: payload.p_name,
      p_description: payload.p_description,
      prod_category: payload.prod_category,
      orderedBy: payload.orderedBy,
      price: payload.price,
    });

    return h
      .response({
        message: "Inserted successfully!",
        productID: newUser.productId,
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};
