import { ResponseToolkit, ResponseObject, Request } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { User } from "../../models/userTableDefinition";
import { productServices } from "../../services/productServices";
import { Product } from "../../models/productTableDefinition";

export const getAllProductsHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const allProducts: Product[] = await productServices.getAllProducts();

    if (!allProducts){
      h.response({error: "All users not found"}).code(400)
    }

    return h.response({
      message: "Retrieved All Users successfully",
      products: allProducts,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};


