import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Users/loginForm";
import './index.css';
import RegisterForm from './Users/registerForm';
import UsersList from "./Users/registeredUsersList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<RegisterForm />} ></Route>
        <Route path="/login" element={<LoginForm />} ></Route>
        <Route path="/users" element={<UsersList/>} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
