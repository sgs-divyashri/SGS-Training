import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Users/loginForm";
import './index.css';
import RegisterForm from './Users/registerForm';
import UsersList from "./Users/registeredUsersList";
import SpecificUser from "./Users/specificUsersList";
import FullUpdateUser from "./Users/fullUpdateUsers";
import CreateTask from "./Tasks/createTask";
import TasksList from "./Tasks/getAllTasksList";
import SpecificTask from "./Tasks/getSpecificTask";
import FullUpdateTask from "./Tasks/fullUpdateTask";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<RegisterForm />} ></Route>
        <Route path="/login" element={<LoginForm />} ></Route>
        <Route path="/users" element={<UsersList/>} ></Route>
        <Route path="/users/:id" element={<SpecificUser />} />
        <Route path="/users/f_update/:id" element={<FullUpdateUser />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/tasks" element={<TasksList />} />
        <Route path="/tasks/:id" element={<SpecificTask />} />
        <Route path="/tasks/f_update/:id" element={<FullUpdateTask />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
