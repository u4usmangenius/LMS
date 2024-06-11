import logo from "../../assests/logo.png"; // Replace with your logo image URL
import "./Sidebar.css";
import React from "react";
import { FaBook, FaCheckCircle, FaHistory, FaInfo } from "react-icons/fa";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  MdAccountBalance,
  MdAssignmentTurnedIn,
  MdCategory,
  MdLocalFireDepartment,
  MdLogout,
} from "react-icons/md";
import { IoLogOut, IoSettingsSharp } from "react-icons/io5";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCog,
  FaChartBar,
  FaStar,
} from "react-icons/fa";
import { IoIosBook, IoMdSchool } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { observer } from "mobx-react-lite";
import { sidebarStore } from "../../store/SidebarStore/SidebarStore";
import { GiDrawbridge, GiExpense } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";

const Sidebar = () => {
  const navigate = useNavigate();
  const Logout = async () => {
    await localStorage.clear();
    const data = await localStorage.getItem("auth");
    if (!data) {
      navigate("/");
    }
  };
  return (
    <div className="grid-container">
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          {/* <h1 className="logo-heading">Result System</h1> */}
          {/* Result Database */}
        </div>
        <span className="sidebar-row"></span>
        <ul className="nav-ul nav-ul-scroll">
          <li>
            <NavLink to="/sidebar/dashboard">
              <AiFillHome /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/students">
              <FaChalkboardTeacher /> Students
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/departments">
              <IoMdSchool /> Departments
            </NavLink>
          </li>

          <li>
            <NavLink to="/sidebar/books">
              <IoIosBook /> Books
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/category">
              <MdCategory /> Category
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/transections">
              <FaBook /> Transections
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/sidebar/about">
              <FaInfo /> About
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/sidebar/history">
              <FaHistory /> History
            </NavLink>
          </li>
          <li>
            <NavLink to="/" onClick={Logout}>
              <MdLogout /> Logout
            </NavLink>
          </li>
        </ul>
        <div className="features">
          {/* <span className="features-label">Features</span>
           */}
        </div>
        {/* <div className="main-container"> */}
      </div>
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default observer(Sidebar);
