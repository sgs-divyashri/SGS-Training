// import { Request, ResponseToolkit } from "@hapi/hapi";
// import { testServices } from "../../services/testServices";

// export const deleteDataHandler = (request: Request, h: ResponseToolkit) => {
//     const id = Number(request.params.id);
//     const data = testServices.deleteData(id);
//     if (data === null) {
//       return h.response({ error: 'Data not found' }).code(404);
//     }
//     return h.response({message: "Soft Deleted User successfully",data: data}).code(200);
// }