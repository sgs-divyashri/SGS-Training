// import { userServices } from "../../services/userServices";
// import { Request, ResponseToolkit } from "@hapi/hapi";

// export const restoreUserHandler = async (request: Request, h: ResponseToolkit) => {
//     try {
//         const id = Number(request.params.userID);
//         if (!id || Number.isNaN(id)) {
//             return h.response({ error: "Invalid user ID" }).code(400);
//         } 

//         const user = await userServices.restoreUser(id);
//         if (!user) return h.response({ error: "User not found or already active" }).code(404);

//         return h.response({ message: "Restored", user }).code(200);
//     } catch (err: any) {
//         return h.response({ error: err.message }).code(500);
//     }
// };
