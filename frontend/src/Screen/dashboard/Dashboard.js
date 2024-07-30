import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaInfoCircle,
  FaFileExport,
  FaFileImport,
} from "react-icons/fa";
import { observer } from "mobx-react-lite";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import { IoIosArrowDropdown } from "react-icons/io";

import logo from "../../assests/logo2.png";
// import logo from "../../assests/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { dashboardStore } from "../../store/DashboardStore/DashboardStore";
import DashboardList from "./DashboardList";
import Loader from "../../components/loaders/Loader";
import {
  BiImport,
  BiSolidFileExport,
  BiSolidFileImport,
  BiSolidLogOut,
} from "react-icons/bi";

const Dashboard = () => {
  const MySwal = withReactContent(Swal);
  const showToast = (
    title,
    icon = "success",
    position = "top-end",
    timer = 3000
  ) => {
    MySwal.fire({
      toast: true,
      title: title,
      icon: icon,
      position: position,
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  const handleClickNotificataion = () => {
    showToast("Notifications unavailable!", "info");
  };

  const { FiltreClassName } = { ...dashboardStore };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const inputRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [auth, setAuth] = useState(localStorage.getItem("bearer token"));
  const navigate = useNavigate();
  const Logout = async () => {
    await localStorage.clear();
    const data = await localStorage.getItem("auth");
    if (!data) {
      navigate("/");
    }
  };
  useEffect(() => {
    dashboardStore.fetchData();
  }, []);
  // }, [dashboardStore.data]);

  useEffect(() => {
    const token = localStorage.getItem("bearer token");
    setAuth(token);
  }, [auth]);

  // Close the dropdown when clicking anywhere outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-top-bar">
          <div className="dashboard-top-left"></div>
          <div className="dahboard-top-right">
            <div
              className="dashboard-notification-icon-orange"
              style={{ marginRight: "41px", cursor: "pointer" }} // Add margin to the right
              onClick={handleClickNotificataion}
            >
              <FaBell />
            </div>
            <div
              className={`profile-icon ${
                isDropdownOpen ? "dashboard-dropdown-active" : ""
              }`}
              onClick={toggleDropdown}
            >
              <img src={logo} alt="Logo" className="dashboard-logo" />
              <span className="dashboard-profile-name">
                SCS
                {/* &gt; */}
              </span>
              <span className="dashboard-profile-name">
                <IoIosArrowDropdown />
              </span>
              <div
                ref={dropdownRef}
                className={`profile-dropdown ${isDropdownOpen ? "open" : ""}`}
              >
                <li onClick={dashboardStore.handleImport}>
                  <BiSolidFileImport />
                  Import
                </li>
                <li onClick={dashboardStore.handleExport}>
                  <BiSolidFileExport />
                  Export
                </li>
                <li onClick={Logout}>
                  <BiSolidLogOut />
                  Logout
                </li>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-cards-container">
          <div className="dashboard-card">
            <div className="dashboard-card-heading">Students</div>
            <div className="dashboard-card-text">
              {dashboardStore.loading && dashboardStore.data.students ? (
                <Loader />
              ) : dashboardStore.data.students ? (
                dashboardStore.data.students
              ) : (
                0
              )}
            </div>
            <div className="dashboard-info-row">
              <div className="dashboard-info-text">More Info</div>
              <div className="dashboard-info-icon">
                <FaInfoCircle />
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div
              className="dashboard-card-heading"
              style={{ marginLeft: "-18%" }}
            >
              Books
            </div>
            <div className="dashboard-card-text">
              {dashboardStore.loading ? (
                <Loader />
              ) : dashboardStore.data.totalBooks ? (
                dashboardStore.data.totalBooks
              ) : (
                0
              )}
            </div>
            <div className="dashboard-info-row">
              <div className="dashboard-info-text">More Info</div>
              <div className="dashboard-info-icon">
                <FaInfoCircle />
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-heading">Transactions</div>
            <div className="dashboard-card-text">
              {dashboardStore.loading ? (
                <Loader />
              ) : dashboardStore.data.transections ? (
                dashboardStore.data.transections
              ) : (
                0
              )}
            </div>
            <div className="dashboard-info-row">
              <div className="dashboard-info-text">More Info</div>
              <div className="dashboard-info-icon">
                <FaInfoCircle />
              </div>
            </div>
          </div>
        </div>
        <DashboardList />

        {/* Rest of your dashboard content */}
      </div>
    </>
  );
};

export default observer(Dashboard);
