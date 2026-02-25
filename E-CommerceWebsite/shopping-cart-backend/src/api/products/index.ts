import type { ServerRoute } from "@hapi/hapi";
import { addProductHandler } from "./addproducts";
import { getProductsHandler } from "./getProducts";
import { delAndResProductHandler } from "./softDeleteProduct";
import { deleteProductHandler } from "./deleteProduct";
import { editProductHandler } from "./editProduct";

export const productRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/add',
        handler: addProductHandler
    },

    {
        method: 'GET',
        path: '/products',
        handler: getProductsHandler,
    },

    {
        method: "PATCH",
        path: "/product/edit/{id}",
        handler: editProductHandler
    },

    {
        method: 'PATCH',
        path: '/product/toggle/{productID}',
        handler: delAndResProductHandler,
    },

    {
        method: 'DELETE',
        path: '/product/{id}',
        handler: deleteProductHandler
    }
]