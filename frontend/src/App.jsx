import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import Home from "./Home";
import Login from "./login";

import API from "./axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await API.get("/verify");
        setIsAuthenticated(res.data.valid);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again.");
        console.log(err);
      }
    };

    verifyToken();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Login />
            }
          />

          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
