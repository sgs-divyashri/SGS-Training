import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./RegistrationForm/loginForm";
// import '../src/LoginForm/loginform.css'
import './index.css';
import RegisterForm from './RegistrationForm/registerForm';
import UsersList from "./RegistrationForm/registeredUsersList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route></Route>
        <Route path="/" element={<RegisterForm />} ></Route>
        <Route path="/login" element={<LoginForm />} ></Route>
        <Route path="/users" element={<UsersList/>} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
