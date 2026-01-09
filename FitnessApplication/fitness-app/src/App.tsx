import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./scenes/navbar";
import { SelectedPage } from "./shared/types";
import Home from "./scenes/Home";
import Benefits from "./scenes/Benefits";
import OurClasses from "./scenes/OurClasses";
import Contact from "./scenes/Contact";
import Register from "./scenes/UserRegister/register";
import Login from "./scenes/UserLogin/login";

function App() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home)
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true)
        setSelectedPage(SelectedPage.Home)
      }
      if (window.screenY !== 0) {
          setIsTopOfPage(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => removeEventListener("scroll", handleScroll)
  }, [])
  return (
    <div className="app min-h-screen bg-red-100">
      <BrowserRouter>
        <Navbar isTopOfPage={isTopOfPage} selectedPage={selectedPage} setSelectedPage={setSelectedPage}/>
        <Routes>
          <Route path="/" element={<Home setSelectedPage={setSelectedPage}/>}></Route>
          <Route path="/benefits" element={<Benefits setSelectedPage={setSelectedPage}/>}></Route>
          <Route path="/class" element={<OurClasses setSelectedPage={setSelectedPage}/>}></Route>
          <Route path="/contact" element={<Contact setSelectedPage={setSelectedPage}/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;