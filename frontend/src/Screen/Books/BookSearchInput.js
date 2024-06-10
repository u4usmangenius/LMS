import React, { useEffect, useRef } from "react";
import { BiSearchAlt2, BiLeftArrowAlt } from "react-icons/bi";
import { observer } from "mobx-react-lite";
import { bookStore } from "../../store/BooksStore/BookStore";
const SearchInput = () => {
  const inputRef = useRef(null);
  const handleSearchTextChange = (text) => {
    bookStore.setSearchText(text);
  };
  const handleMouseEnter = () => {
    if (bookStore.mouseHover) {
      bookStore.mouseHover = false;
    } else {
      bookStore.mouseHover = true;
    }
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
            <option value="category">category</option>
            <option value="remarks">remarks</option>
            <option value="acc_no">acc_no</option>
            <option value="title">title</option>
            <option value="author">author</option>
            <option value="publisher">publisher</option>
            <option value="cost">cost</option>
            <option value="quantity">quantity</option>
          </select>

          <input
            type="text"
            className="FormList-text-input"
            placeholder="Search for a test"
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
