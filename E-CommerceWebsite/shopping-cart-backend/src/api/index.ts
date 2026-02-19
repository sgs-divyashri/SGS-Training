import { productRoutes } from "./products/index";
import { userRoutes } from "./users";
import { categoryRoutes } from "./categories";
import { userOrderRoutes } from "./orders.ts";
import { cartItemRoutes } from "./cartItems";
import { viewOrderRoutes } from "./viewOrders";

export default [...userRoutes, ...productRoutes, ...categoryRoutes, ...userOrderRoutes, ...cartItemRoutes, ...viewOrderRoutes]
