// import { taskRoutes } from "./tasks/index";
import { taskRoutes } from "./tasks";
import { userRoutes } from "./users/index";

export default [...userRoutes, ...taskRoutes]