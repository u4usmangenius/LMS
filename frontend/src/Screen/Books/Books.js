import React from "react";

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
            // onClick={openAddTestsModal}
          >
            Add Books
          </button>
        </div>
      </div>{" "}
    </>
  );
};

export default Books;
