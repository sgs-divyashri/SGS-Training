import { taskRoutes } from "./tasks/task";
import { userRoutes } from "./users/user";

export default [...userRoutes, ...taskRoutes]