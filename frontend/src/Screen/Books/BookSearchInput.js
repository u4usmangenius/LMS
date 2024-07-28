import React, { useEffect, useRef } from "react";
import { BiSearchAlt2, BiLeftArrowAlt } from "react-icons/bi";
import { observer } from "mobx-react-lite";
import { bookStore } from "../../store/BooksStore/BookStore";
const SearchInput = () => {
  const inputRef = useRef(null);
  const handleSearchTextChange = (text) => {
    bookStore.setSearchText(text);
  };
  return (
    <>
      <div className={`Form-search-bar Set-Form-search-bar`}>
        <div className={`Search-Container Show-Search-Container`}>
          <select
            className="Form-search-category"
            value={bookStore.selectedFilter}
            onChange={(e) => bookStore.setSelectedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="remarks">Remarks</option>
            <option value="acc_no">Acc_No</option>
            <option value="title">Book Title</option>
            <option value="author">Author</option>
            <option value="publisher">Publisher</option>
          </select>

          <input
            type="text"
            className="FormList-text-input"
            placeholder="Search Book"
            value={bookStore.searchText}
            onChange={(e) => {
              bookStore.setSearchText(e.target.value);
              bookStore.fetchDataFromBackend(1);
            }}
            ref={inputRef}
          />
          <button
            className="Form-List-search-button"
            onClick={() => {
              handleSearchTextChange("");
              inputRef.current.focus();
              bookStore.fetchDataFromBackend();
            }}
            ref={inputRef}
          >
            Clear
          </button>
          <div className="Form-List-page-rows">
            <select
              type="text"
              className="Form-search-category"
              placeholder="Enter Rows Per Page"
              value={bookStore.rowsPerPage}
              onChange={(e) => {
                let value = e.target.value;
                if (
                  value === "" ||
                  (parseInt(value) >= 1 && parseInt(value) <= 100)
                ) {
                  bookStore.setrowsPerPage(value);
                }
              }}
            >
              <option>5</option>
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(SearchInput);
