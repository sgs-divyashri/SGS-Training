
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="ml-auto flex gap-4">
          <NavLink to="/users" className={({ isActive }) => `px-3 py-2 rounded-md ${isActive ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-pink-100"}`}>
            Users
          </NavLink>
          <NavLink to="/tasks/create" className={({ isActive }) => `px-3 py-2 rounded-md ${isActive ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-pink-100"}`}>
            Create Task
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `px-2 py-2 rounded-md ${isActive ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-pink-100"}`}>
            Tasks
          </NavLink>
          <NavLink to="/" className={({ isActive }) => `px-3 py-2 rounded-md ${isActive ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-pink-100"}`}>
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

// import { NavLink, useNavigate } from "react-router-dom";

// export default function NavBar() {
//     const navigate = useNavigate();

//     return (
//         <nav className="bg-white shadow-md border-b border-gray-200">
//             <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//                 <h1 className="text-pink-600 font-bold text-xl">Task Manager</h1>
//                 <div className="flex gap-4">
//                     <NavLink to="/users"className={({ isActive }) => `px-3 py-2 rounded-md ${isActive ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-pink-100"}`}>
//                         Users
//                     </NavLink>
//                     <NavLink to="/tasks" className={({ isActive }) => `px-3 py-2 rounded-md ${isActive ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-pink-100"}`}>
//                         Create Task
//                     </NavLink>
//                     <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-md bg-blue-300 text-white hover:bg-blue-400">
//                         Go Back
//                     </button>
//                     <button onClick={() => navigate("/")} className="px-3 py-2 rounded-md bg-red-400 text-white hover:bg-red-500">
//                         Logout
//                     </button>
//                 </div>
//             </div>
//         </nav>
//     );
// }