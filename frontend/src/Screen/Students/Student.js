import React from "react";
import { modelStore } from "../../store/ModelStore/ModelStore";
import Modal from "../model/Modal";
import Addstudents from "./AddStudents";
import { observer } from "mobx-react-lite";
import StudentList from "./StudentList";

const students = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="formlist-list-container">
        <div className="formlist-header-row">
          <h1>students</h1>
          {/* <TestSearchInput/> */}
          <button
            className="formlist-click-add-button"
            onClick={async () => {
              console.log("clicked");
              modelStore.setisModalOpen(true);
              // await feeAccount.getCurrentMonthDates();
            }}
          >
            Add students
          </button>
        </div>
        <div>
          {modelStore.isModalOpen ? (
            <>
              <Modal
                isOpen={modelStore.isModalOpen}
                onClose={modelStore.closeModel}
              >
                <Addstudents />
              </Modal>
            </>
          ) : null}
          <StudentList/>
        </div>
      </div>{" "}
    </>
  );
};

export default observer(students);
