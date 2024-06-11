import React from "react";
import "../styles/FormList.css"
import Header from "../header/Header";
const Student = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="formlist-list-container">
        <div className="formlist-header-row">
          <h1>Student</h1>
          {/* <TestSearchInput/> */}
          <button
            className="formlist-click-add-button"
            // onClick={openAddTestsModal}
          >
            Add Students
          </button>
        </div>
      </div>
    </>
  );
};

export default Student;
