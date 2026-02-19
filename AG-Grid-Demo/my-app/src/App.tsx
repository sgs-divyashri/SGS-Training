import { Route, Routes } from "react-router-dom";
import { GridExample } from "./ag-grid";

function App() {
  return (
    <>
      <section>
        <Routes>
            <Route path="/" element={<GridExample />} />
        </Routes>
      </section>
    </>
  );
}

export default App;