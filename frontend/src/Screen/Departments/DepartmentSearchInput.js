import React, { useEffect, useRef } from "react";
import { BiSearchAlt2, BiLeftArrowAlt } from "react-icons/bi";
import { observer } from "mobx-react-lite";
import { departmentStore } from "../../store/DepartmentStore/DepartmentStore";
const SearchInput = () => {
  const inputRef = useRef(null);
  const handleSearchTextChange = (text) => {
    departmentStore.setSearchText(text);
  };
  return (
    <>
      <div className={`Form-search-bar Set-Form-search-bar`}>
        <div className={`Search-Container Show-Search-Container`}>
          <select
            className="Form-search-category"
            value={departmentStore.selectedFilter}
            onChange={(e) => departmentStore.setSelectedFilter(e.target.value)}
            style={{
              width:"121px"
            }}
          >
            <option value="department_name">Departments</option>
          </select>

          <input
            type="text"
            className="FormList-text-input"
            placeholder="Search department"
            value={departmentStore.searchText}
            onChange={(e) => {
              departmentStore.setSearchText(e.target.value);
              departmentStore.fetchDataFromBackend(1);
            }}
            ref={inputRef}
          />
          <button
            className="Form-List-search-button"
            onClick={() => {
              handleSearchTextChange("");
              inputRef.current.focus();
              departmentStore.fetchDataFromBackend();
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
              value={departmentStore.rowsPerPage}
              onChange={(e) => {
                let value = e.target.value;
                if (
                  value === "" ||
                  (parseInt(value) >= 1 && parseInt(value) <= 100)
                ) {
                  departmentStore.setrowsPerPage(value);
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
