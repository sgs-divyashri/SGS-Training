
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="ml-auto flex gap-4">
          <NavLink to="/users" className={({ isActive }) => `${isActive ? "underline underline-offset-4 decoration-pink-500 decoration-2" : "hover:underline underline-offset-4"}`}>
            Users
          </NavLink>
          <NavLink to="/tasks-create" className={({ isActive }) => `${isActive ? "underline underline-offset-4 decoration-pink-500 decoration-2" : "hover:underline underline-offset-4"}`}>
            Create Task
          </NavLink>
          <NavLink to="/users-task" className={({ isActive }) => `${isActive ? "underline underline-offset-4 decoration-pink-500 decoration-2" : "hover:underline underline-offset-4"}`}>
            Tasks
          </NavLink>
          <NavLink to="/" className={({ isActive }) => `${isActive ? "underline underline-offset-4 decoration-pink-500 decoration-2" : "hover:underline underline-offset-4"}`}>
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
