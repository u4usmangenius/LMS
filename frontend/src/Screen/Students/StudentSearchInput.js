import React, { useEffect, useRef } from "react";
import { BiSearchAlt2, BiLeftArrowAlt } from "react-icons/bi";
import { observer } from "mobx-react-lite";
import { studentStore } from "../../store/StudentsStore/StudentStore";
const SearchInput = () => {
  const inputRef = useRef(null);
  const handleSearchTextChange = (text) => {
    studentStore.setSearchText(text);
  };
  return (
    <>
      <div className={`Form-search-bar Set-Form-search-bar`}>
        <div className={`Search-Container Show-Search-Container`}>
          <select
            className="Form-search-category"
            value={studentStore.selectedFilter}
            onChange={(e) => studentStore.setSelectedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="roll_no">Roll No</option>
            <option value="name">Name</option>
            <option value="address">Address</option>
            <option value="phone_no">Phone</option>
            <option value="gender">Gender</option>
          </select>

          <input
            type="text"
            className="FormList-text-input"
            placeholder="Search Student"
            value={studentStore.searchText}
            onChange={(e) => {
              studentStore.setSearchText(e.target.value);
              studentStore.fetchDataFromBackend(1);
            }}
            ref={inputRef}
          />
          <button
            className="Form-List-search-button"
            onClick={() => {
              handleSearchTextChange("");
              inputRef.current.focus();
              studentStore.fetchDataFromBackend();
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
              value={studentStore.rowsPerPage}
              onChange={(e) => {
                let value = e.target.value;
                if (
                  value === "" ||
                  (parseInt(value) >= 1 && parseInt(value) <= 100)
                ) {
                  studentStore.setrowsPerPage(value);
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
