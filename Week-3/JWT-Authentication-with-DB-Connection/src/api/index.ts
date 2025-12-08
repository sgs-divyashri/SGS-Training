import { taskRoutes } from "./tasks/index";
import { userRoutes } from "./users/index";

export default [...userRoutes, ...taskRoutes]
