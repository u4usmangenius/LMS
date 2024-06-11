import React from "react";
import { modelStore } from "../../store/ModelStore/ModelStore";
import Modal from "../model/Modal";
import Addtransections from "./AddTransection";
import { observer } from "mobx-react-lite";
import TransectionList from "./TransectionList";

const transections = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="formlist-list-container">
        <div className="formlist-header-row">
          <h1>Transections</h1>
          {/* <TestSearchInput/> */}
          <button
            className="formlist-click-add-button"
            onClick={async () => {
              console.log("clicked");
              modelStore.setisModalOpen(true);
              // await feeAccount.getCurrentMonthDates();
            }}
          >
            New Transection
          </button>
        </div>
        <div>
          {modelStore.isModalOpen ? (
            <>
              <Modal
                isOpen={modelStore.isModalOpen}
                onClose={modelStore.closeModel}
              >
                <Addtransections />
              </Modal>
            </>
          ) : null}
          <TransectionList/>
        </div>
      </div>{" "}
    </>
  );
};

export default observer(transections);
