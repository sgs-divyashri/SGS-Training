import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";
import { sequelize } from "../../sequelize/sequelize";
import { validateEmail } from "../users/emailValidation";
import { userServices } from "../../services/userServices";

export const getSpecificUserTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
        const { userId, email } = request.auth.credentials as { userId?: number; email?: string };

        const userTasks = await taskServices.getSpecificUserTasks(Number(userId));
        if (!userTasks) {
            return h.response({ error: "No tasks found for this user" }).code(404);
        }
        
        return h.response({
            message: "Retrieved specific user's tasks successfully",
            tasks: userTasks,
        }).code(200);

    } catch (err: any) {
        console.error(err);
        return h.response({ error: err.message }).code(400);
    }
}
