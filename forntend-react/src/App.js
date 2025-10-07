import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../src/pages/home";
import Navbar from "./components/navbar";
import AddUser from "../src/pages/addUser";
import ViewUser from "../src/pages/viewUser";
// import ViewUser from "../src/pages/viewUser";
// import {}
function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Navbar />

      {
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/editUser/:id" element={<AddUser />} />
          <Route path="/ViewUser/:id" element={<ViewUser />} />
        </Routes>
      }
    </div>
  );
}

export default App;
