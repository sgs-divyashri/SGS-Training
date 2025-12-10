// import { Request, ResponseToolkit } from "@hapi/hapi";
// import { testServices, UserPayload } from "../../services/testServices";

// export const fullUpdateDataHandler = async (request: Request, h: ResponseToolkit) => {
//     const id = Number(request.params.id);
//     const payload = request.payload as UserPayload;
//     const user_update = await testServices.fullUpdateData(id, payload);
//     if(!user_update){
//         h.response({message: "Error Updating data..."})
//     }

//     return h.response({
//       message: "Fully Updated Users successfully",
//       user: user_update,
//     }).code(200);
// }