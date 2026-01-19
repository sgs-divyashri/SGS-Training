import type { ServerRoute } from "@hapi/hapi";
import { addProductHandler } from "./addproducts";
import { getProductsHandler } from "./getFilteredProducts";
import { delAndResProductHandler } from "./softDeleteProduct";


export const productRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/add',
        handler: addProductHandler,
        options: {
            auth: false,
        },
    },

    {
        method: 'GET',
        path: '/products',
        handler: getProductsHandler,
        // options: {
        //     auth: false,
        // },
    },

    // {
    //     method: 'GET',
    //     path: '/users/{id}',
    //     handler: getSpecificUserHandler
    // },

    // {
    //     method: "PUT",
    //     path: "/users/f_update/{id}",
    //     handler: fullUpdateUserHandler
    // },

    // {
    //     method: "PATCH",
    //     path: "/users/p_update/{id}",
    //     handler: partialUpdateUserHandler
    // },

    // // {
    // //     method: "PATCH",
    // //     path: "/users/restore/{userID}",
    // //     handler: restoreUserHandler
    // // },

    {
        method: 'PATCH',
        path: '/product/toggle/{productID}',
        handler: delAndResProductHandler,
    }
]