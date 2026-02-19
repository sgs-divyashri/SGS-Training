import type { ServerRoute } from "@hapi/hapi";
import { addProductCategoryHandler } from "../categories/addCategory";
import { editProductCtegoryHandler } from "./editCategory";
import { deleteProductCategoryHandler } from "./deleteCategory";
import { getCategoryHandler } from "./getCategory";

export const categoryRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/add/category",
    handler: addProductCategoryHandler,
  },

  {
    method: "GET",
    path: "/categories",
    handler: getCategoryHandler,
  },

  {
    method: "PATCH",
    path: "/category/edit/{id}",
    handler: editProductCtegoryHandler,
  },

  {
    method: "DELETE",
    path: "/category/{id}",
    handler: deleteProductCategoryHandler,
  },
];
