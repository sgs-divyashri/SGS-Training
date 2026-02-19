import type { ServerRoute } from "@hapi/hapi";
import { addProductHandler } from "./addproducts";
import { getFilteredProductsHandler } from "./getFilteredProducts";
import { getAllProductsHandler } from "./getAllProducts";
import { delAndResProductHandler } from "./softDeleteProduct";
import { deleteProductHandler } from "./deleteProduct";
import { editProductHandler } from "./editProduct";
import { notifyProductHandler } from "./notifyProducts";

export const productRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/add',
        handler: addProductHandler
    },

    {
        method: 'GET',
        path: '/products',
        handler: getAllProductsHandler,
    },

    {
        method: 'GET',
        path: '/filtered-products',
        handler: getFilteredProductsHandler,
    },

    {
        method: "PATCH",
        path: "/product/edit/{id}",
        handler: editProductHandler
    },

    {
        method: 'PATCH',
        path: '/notify/{productID}',
        handler: notifyProductHandler,
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