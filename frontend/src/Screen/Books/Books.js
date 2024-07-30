import React from "react";
import { modelStore } from "../../store/ModelStore/ModelStore";
import Modal from "../model/Modal";
import AddBooks from "./AddBooks";
import { observer } from "mobx-react-lite";
import BooksList from "./BooksList";

const Books = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="formlist-list-container">
        <div className="formlist-header-row">
          <h1>Books</h1>
          {/* <TestSearchInput/> */}
          <button
            className="formlist-click-add-button"
            onClick={async () => {
              console.log("clicked");
              modelStore.setisModalOpen(true);
              // await feeAccount.getCurrentMonthDates();
            }}
          >
            Add Books
          </button>
        </div>
        <div>
          {modelStore.isModalOpen ? (
            <>
              <Modal
                isOpen={modelStore.isModalOpen}
                onClose={modelStore.closeModel}
              >
                <AddBooks />
              </Modal>
            </>
          ) : null}
          <BooksList/>
        </div>
      </div>{" "}
    </>
  );
};

export default observer(Books);
