import React from "react";
import { modelStore } from "../../store/ModelStore/ModelStore";
import Modal from "../model/Modal";
import Adddepartments from "./AddDepartment";
import { observer } from "mobx-react-lite";
import DepartmentList from "./DepartmentList";

const Departments = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="formlist-list-container">
        <div className="formlist-header-row">
          <h1>Departments</h1>
          {/* <TestSearchInput/> */}
          <button
            className="formlist-click-add-button"
            onClick={async () => {
              console.log("clicked");
              modelStore.setisModalOpen(true);
              // await feeAccount.getCurrentMonthDates();
            }}
          >
            Add New
          </button>
        </div>
        <div>
          {modelStore.isModalOpen ? (
            <>
              <Modal
                isOpen={modelStore.isModalOpen}
                onClose={modelStore.closeModel}
              >
                <Adddepartments />
              </Modal>
            </>
          ) : null}
          <DepartmentList/>
        </div>
      </div>{" "}
    </>
  );
};

export default observer(Departments);
