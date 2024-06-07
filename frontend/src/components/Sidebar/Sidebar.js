import logo from "../../assests/logo.png"; // Replace with your logo image URL
import "./Sidebar.css";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { MdAccountBalance, MdAssignmentTurnedIn } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCog,
  FaChartBar,
  FaStar,
} from "react-icons/fa";
import { IoIosBook } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { observer } from "mobx-react-lite";
import { sidebarStore } from "../../store/SidebarStore/SidebarStore";
import { GiExpense } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";

const Sidebar = () => {
  const navigate = useNavigate();
  const Progress = () => {
    // addstudentStore.showAlert("In Progess..");
    // navigate("#/sidebar/dashboard");
    return;
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
            <NavLink to="/sidebar/teachers">
              <FaChalkboardTeacher /> Teachers
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/students">
              <FaUserGraduate /> Students
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/subject">
              <IoIosBook /> Subjects
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/test">
              <MdAssignmentTurnedIn /> Test
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/result">
              <FaCheckCircle /> Result
            </NavLink>
          </li>
          <li>
            <NavLink to="/sidebar/reports">
              <FaChartBar /> Reports
            </NavLink>
          </li>
          <li>
            {/* <div className="diable-navlink"> */}
            <NavLink
              to={`${
                sidebarStore.feeORExpense === "fees"
                  ? "/sidebar/FeeAccount"
                  : sidebarStore.feeORExpense === "expense"
                  ? "/sidebar/ExpenseAccount"
                  : "/sidebar/ExpenseAccount"
              }`}
              // id="w"
              className="diable-navlink"
              onMouseEnter={() => {
                sidebarStore.setatHover(true);
              }}
              onMouseLeave={() => {
                sidebarStore.setatHover(false);
              }}
            >
              <MdAccountBalance /> Accounts
            </NavLink>
            {/* </div> */}

            {sidebarStore.athover ? (
              <div className="set-hover-div">
                <NavLink
                  className="navlink"
                  to="/sidebar/FeeAccount"
                  onClick={() => {
                    if (sidebarStore.feeORExpense === "fees") {
                      return;
                    }
                    sidebarStore.setatHover(false);
                    sidebarStore.setfeeORExpense("fees");
                  }}
                  onMouseEnter={() => {
                    sidebarStore.setatHover(true);
                  }}
                  onMouseLeave={() => {
                    sidebarStore.setatHover(false);
                  }}
                >
                  <PiStudentBold />
                  Fee
                </NavLink>
                <NavLink
                  className="navlink"
                  to="/sidebar/ExpenseAccount"
                  onClick={() => {
                    if (sidebarStore.feeORExpense === "expense") {
                      return;
                    }
                    sidebarStore.setatHover(false);
                    sidebarStore.setfeeORExpense("expense");
                  }}
                  onMouseEnter={() => {
                    sidebarStore.setatHover(true);
                  }}
                  onMouseLeave={() => {
                    sidebarStore.setatHover(false);
                  }}
                >
                  <GiExpense />
                  Expense
                </NavLink>
              </div>
            ) : null}
          </li>
          <li>
            <NavLink to="/sidebar/Setting">
              <IoSettingsSharp /> Setting
            </NavLink>
          </li>

          {/* <li>
            <Link onClick={Progress}>
              <FaCog /> Settings
            </Link>
          </li> */}
          <li>
            <Link onClick={Progress} id="features">
              <FaStar /> Features
              <div className="new-feature">NEW</div>
            </Link>
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
