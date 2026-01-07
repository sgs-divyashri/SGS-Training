// import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
// import { taskServices } from "../../services/taskServices";

// export const softDeleteTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
//     try {
//         const id: string = request.params.id;

//         const task = await taskServices.softDeleteTask(id);
//         console.log(task)
//         if (task === null) {
//             return h.response({ error: 'Task not found or already deleted' }).code(404);
//         }

//         return h.response({
//             message: "Soft Deleted Task successfully",
//             task: task,
//         }).code(200);

//     } catch (err: any) {
//         console.error(err);
//         return h.response({ error: err.message }).code(400);
//     }
// }