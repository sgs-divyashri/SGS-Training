import { productRoutes } from "./products/index";
import { userRoutes } from "./users";

export default [...userRoutes, ...productRoutes]
