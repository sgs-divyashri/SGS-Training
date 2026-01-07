import { useState, useEffect } from "react";
import { Navbar } from "./scenes/navbar";
import { SelectedPage } from "./shared/types";
import Home from "./scenes/Home";

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
      <Navbar isTopOfPage={isTopOfPage} selectedPage={selectedPage} setSelectedPage={setSelectedPage}/>
      <Home setSelectedPage={setSelectedPage}/>
    </div>
  )
}

export default App;
