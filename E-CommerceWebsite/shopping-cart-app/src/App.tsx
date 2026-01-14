import "./index.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import NavBar from "./components/navbar";
import AuthPage from "./components/authPage";
import AuthLayout from "./components/authLayouts";
import CartPage from "./pages/cart";
import ResetPassword from "./components/resetPassword";

function App() {
  return (
    <>
      <section>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<NavBar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Routes>
      </section>
    </>
  );
}

export default App;