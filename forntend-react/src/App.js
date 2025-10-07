import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import AddUser from "./pages/addUser";
import ViewUser from "./pages/viewUser";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        {/* Toast Container with Theme Support */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="!z-[9999]"
          toastClassName={() =>
            "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
          }
          bodyClassName={() => "text-sm font-white block p-3"}
        />
        
        <Layout>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/editUser/:id" element={<AddUser />} />
            <Route path="/ViewUser/:id" element={<ViewUser />} />
          </Routes>
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App;
