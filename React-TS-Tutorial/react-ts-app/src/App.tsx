import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Users/loginForm";
import './index.css';
import RegisterForm from './Users/registerForm';
import UsersList from "./Users/registeredUsersList";
import SpecificUser from "./Users/specificUsersList";
import FullUpdateUser from "./Users/fullUpdateUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<RegisterForm />} ></Route>
        <Route path="/login" element={<LoginForm />} ></Route>
        <Route path="/users" element={<UsersList/>} ></Route>
        <Route path="/users/:id" element={<SpecificUser />} />
        <Route path="/users/f_update/id" element={<FullUpdateUser />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
