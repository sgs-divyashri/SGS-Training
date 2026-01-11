import "./index.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Store from "./pages/store";
import About from "./pages/about";
import NavBar from "./components/navbar";
import AuthPage from "./components/authPage";
import AuthLayout from "./components/authLayouts";
import CartPage from "./pages/cart";

function App() {
  return (
    <>
      <section>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<AuthPage />} />
          </Route>
          <Route element={<NavBar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Routes>
      </section>
    </>
  );
}

export default App;
