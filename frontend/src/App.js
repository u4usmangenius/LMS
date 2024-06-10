import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Error from "./Screen/error/Error";
import Dashboard from "./Screen/dashboard/Dashboard";
import Books from "./Screen/Books/Books";
import Student from "./Screen/Students/Student";
import Category from "./Screen/Category/Category";
import Departments from "./Screen/Departments/Departments";
import About from "./Screen/About/About";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./components/Login/Login";
import { loginstore } from "./store/LoginStore/LoginStore";
import LoadingSpinner from "./components/loaders/Spinner";
function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = await loginstore.getUserDetails(); // Assuming loginstore.username is set after login
        console.log(userDetails, "-----------------------------");
        if (userDetails && userDetails.email && userDetails.phone) {
          loginstore.setUserExists(true);
        } else {
          loginstore.setUserExists(false);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  loginstore.auth = localStorage.getItem("bearer token");
  useEffect(() => {
    const checkTokenExpiration = () => {
      let tokenExpiration = localStorage.getItem("tokenExpiration");
      const currentTime = Math.floor(Date.now() / 1000);
      if (tokenExpiration && currentTime > parseInt(tokenExpiration, 10)) {
        loginstore.showWarning("Session Expired. Please Login Again...");
        loginstore.logoutUser = 500;
        localStorage.clear();
        loginstore.logoutUser = null;
        navigate("/");
      }
    };
    // Check token expiration periodically
    const tokenExpirationCheckInterval = setInterval(
      checkTokenExpiration,
      loginstore.logoutUser
    );
    return () => {
      // Clear the interval when the component unmounts
      clearInterval(tokenExpirationCheckInterval);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    ); // Render a loading indicator while fetching data
  }
  return (
    <div>
      <Routes>
        {loginstore.auth && (
          <Route
            path="/"
            element={<Navigate to="/sidebar/dashboard" replace />}
          />
        )}
        {!loginstore.auth && <Route path="/" element={<Login />} />}
        {loginstore.auth && (
          <Route path="sidebar" element={<Sidebar />}>
            <Route path="/sidebar/dashboard" element={<Dashboard />} />
            <Route path="/sidebar/students" element={<Student />} />
            <Route path="/sidebar/books" element={<Books />} />
            <Route path="/sidebar/category" element={<Category />} />
            <Route path="/sidebar/departments" element={<Departments />} />
            <Route path="/sidebar/about" element={<About />} />
            <Route path="*" element={<Error />} />
          </Route>
        )}
        {!loginstore.auth && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </div>
  );
}

export default App;
