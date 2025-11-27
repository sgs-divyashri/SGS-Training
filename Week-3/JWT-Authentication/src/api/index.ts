// import { taskRoutes } from "./tasks/index";
import { taskRoutes } from "./tasks";
import { testRoutes } from "./test";
import { userRoutes } from "./users/index";

export default [...userRoutes, ...taskRoutes, ...testRoutes]