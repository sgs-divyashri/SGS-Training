// import { Request, ResponseToolkit } from "@hapi/hapi";
// import { UserPayload } from "../../services/testServices";
// import { testServices } from "../../services/testServices";

// export const insertDataHandler = async (request: Request, h: ResponseToolkit) => {
//     const { name } = request.payload as UserPayload;
//     if (!name) {
//         return h.response({ error: "name is required" }).code(400);
//     }
//     console.log("Name: ", name)
//     const user = await testServices.insertData(name)
//     console.log("Data: ", user)
//     return h.response({
//         message: "Inserted successfully!",
//         user
//     });

// }