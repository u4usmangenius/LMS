import React, { useRef } from "react";
import "./Dashboard.css";
import {
  FaBell,
  FaFileExport,
  FaFileImport,
  FaInfoCircle,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assests/logo.png"; // Replace with your logo image URL
import { IoIosArrowDropdown } from "react-icons/io";

const Dashboard = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const Logout = async () => {
    await localStorage.clear();
    const data = await localStorage.getItem("auth");
    if (!data) {
      navigate("/");
    }
  };

  return (
    <>
      {/* <h1>ard</h1> */}
      <div className="dashboard-container">
        <div className="dashboard-top-bar">
          <div className="dashboard-top-left">
            <div className="dashboard-search-bar">
              <div className="dashboard-search-icon">
                <button
                  className="dashboard-ref-search-btn"
                  onClick={() => {
                    inputRef.current.focus();
                  }}
                >
                  <FaSearch />
                </button>
              </div>
              <input
                type="text"
                ref={inputRef}
                onChange={(e) => {
                  if (
                    e.target.value > 999999999999999 ||
                    e.target.value.length > 15
                  ) {
                    e.target.value = "";
                  }
                }}
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="dahboard-top-right">
            <div
              className="dashboard-notification-icon-orange"
              style={{ marginRight: "41px" }} // Add margin to the right
            >
              <FaBell />
            </div>
            <div
              //  ${ isDropdownOpen ? "dashboard-dropdown-active" : ""}
              className={`profile-icon`}
              // onClick={toggleDropdown}
            >
              {/* <img src={logo} alt="Logo" className="dashboard-logo" /> */}
              <span className="dashboard-profile-name">
                SCS
                {/* &gt; */}
                <IoIosArrowDropdown />
              </span>
              <div
                // ref={dropdownRef}
                // ${isDropdownOpen ? "open" : ""}
                className={`profile-dropdown
                  `}
              >
                <ul>
                  <li
                  // onClick={dashboardStore.handleExport}
                  >
                    <FaFileExport />
                    Export
                  </li>
                </ul>
                <ul>
                  <li
                  //  onClick={dashboardStore.handleImport}
                  >
                    <FaFileImport />
                    Import
                  </li>
                </ul>
                <ul>
                  <li onClick={Logout}>
                    <FaSignOutAlt />
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="Form-search-bar">
          <select
            className="Form-filter-ClassName"
            // value={dashboardStore.FiltreClassName}
            // onChange={(e) => (dashboardStore.FiltreClassName = e.target.value)}
          >
            <option value="2nd Year">2nd Year</option>
            <option value="1st Year">1st Year</option>
          </select>
        </div>
        <div className="dashboard-cards-container">
          <div className="dashboard-card">
            <div className="dashboard-card-heading">Teachers</div>
            <div className="dashboard-card-text">
              {/* {dashboardStore.data.totalTeachers} */}
              100
            </div>
            <div className="dashboard-info-row">
              <div className="dashboard-info-text">More Info</div>
              <div className="dashboard-info-icon">
                <FaInfoCircle />
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-heading">Students</div>
            <div className="dashboard-card-text">
              {/* {dashboardStore.data.totalStudents} */}
            </div>
            <div className="dashboard-info-row">
              <div className="dashboard-info-text">More Info</div>
              <div className="dashboard-info-icon">
                <FaInfoCircle />
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-heading">
              {/* {dashboardStore.FiltreClassName} */}
            </div>
            <div className="dashboard-card-text">
              100
              {/* {dashboardStore.FiltreClassName === "1st Year"
                ? dashboardStore.data.totalFirstYearStudents
                : dashboardStore.data.totalSecondYearStudents} */}
            </div>
            <div className="dashboard-info-row">
              <div className="dashboard-info-text">More Info</div>
              <div className="dashboard-info-icon">
                <FaInfoCircle />
              </div>
            </div>
          </div>
        </div>

        {/* <StudentProgressChart /> */}

        {/* Rest of your dashboard content */}
      </div>
    </>
  );
};

export default Dashboard;
