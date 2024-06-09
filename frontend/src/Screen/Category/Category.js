import React from "react";
import { modelStore } from "../../store/ModelStore/ModelStore";
import Modal from "../model/Modal";
import AddCategory from "./AddCategory";
import { observer } from "mobx-react-lite";
import CategoryList from "./CategoryList";

const Category = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="formlist-list-container">
        <div className="formlist-header-row">
          <h1>Category</h1>
          {/* <TestSearchInput/> */}
          <button
            className="formlist-click-add-button"
            onClick={async () => {
              console.log("clicked");
              modelStore.setisModalOpen(true);
              // await feeAccount.getCurrentMonthDates();
            }}
          >
            Add Category
          </button>
        </div>
      </div>
      {modelStore.isModalOpen ? (
        <>
          <Modal
            isOpen={modelStore.isModalOpen}
            onClose={modelStore.closeModel}
          >
            <AddCategory />
          </Modal>
        </>
      ) : null}
      <CategoryList />
    </>
  );
};

export default observer(Category);
