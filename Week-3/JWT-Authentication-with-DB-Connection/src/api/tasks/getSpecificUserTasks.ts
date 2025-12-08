import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";

export const getSpecificUserTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
        const userID = Number(request.params.id);

        const userTasks = await taskServices.getSpecificUserTasks(userID);
        if (!userTasks) {
            return h.response({ error: "No tasks found for this user" }).code(404);
        }

        return h.response({
            message: "Retrieved specific user's tasks successfully",
            task: userTasks,
        }).code(200);

    } catch (err: any) {
        console.error(err);
        return h.response({ error: err.message }).code(400);
    }
}
