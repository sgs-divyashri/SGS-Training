import "./index.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthPage } from "./components/AuthPage";
import { ManageBoard } from "./components/ManageUsersTasks";
import { NavBar } from "./components/Navbar";
import { ViewBoard } from "./components/UsersTasks";

export let globalNavigate: ReturnType<typeof useNavigate>;

function App() {
  const navigate = useNavigate();
  globalNavigate = navigate;
  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 72,
          right: 16,
        }}
        toastOptions={{
          duration: 4000,
          style: { zIndex: 9999 },
        }}
        reverseOrder={false}
      />

      <section>
        <Routes>
          <Route>
            <Route path="/" element={<AuthPage />} />
          </Route>

          <Route element={<NavBar />}>
            <Route path="/manage-board" element={<ManageBoard />} />
            <Route path="/view-board" element={<ViewBoard />} />
          </Route>
        </Routes>
      </section>
    </>
  );
}

export default App;
