import React, { useEffect, useRef } from "react";
import { BiSearchAlt2, BiLeftArrowAlt } from "react-icons/bi";
import { observer } from "mobx-react-lite";
import { transectionStore } from "../../store/TransectionStore/TransectionStore";
const SearchInput = () => {
  const inputRef = useRef(null);
  const handleSearchTextChange = (text) => {
    transectionStore.setSearchText(text);
  };
  return (
    <>
      <div className={`Form-search-bar Set-Form-search-bar`}>
        <div className={`Search-Container Show-Search-Container`}>
          <select
            className="Form-search-category"
            value={transectionStore.selectedFilter}
            onChange={(e) => transectionStore.setSelectedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="title">title</option>
            <option value="name">name</option>
            <option value="department_name">department_name</option>
            <option value="category">category</option>
            <option value="phone_no ">phone_no</option>
          </select>

          <input
            type="text"
            className="FormList-text-input"
            placeholder="Search for a transection"
            value={transectionStore.searchText}
            onChange={(e) => {
              transectionStore.setSearchText(e.target.value);
              transectionStore.fetchDataFromBackend(1);
            }}
            ref={inputRef}
          />
          <button
            className="Form-List-search-button"
            onClick={() => {
              handleSearchTextChange("");
              inputRef.current.focus();
              transectionStore.fetchDataFromBackend();
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
              value={transectionStore.rowsPerPage}
              onChange={(e) => {
                let value = e.target.value;
                if (
                  value === "" ||
                  (parseInt(value) >= 1 && parseInt(value) <= 100)
                ) {
                  transectionStore.setrowsPerPage(value);
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
