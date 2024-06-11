import React, { useEffect, useRef } from "react";
import { IoMdTrash } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import LoadingSpinner from "../../components/loaders/Spinner";
import { observer } from "mobx-react-lite";
import { departmentStore } from "../../store/DepartmentStore/DepartmentStore";
import { addDepartmentStore } from "../../store/DepartmentStore/AddDepartmentStore";
import NoData from "../../assests/noData.png";
import { modelStore } from "../../store/ModelStore/ModelStore";
import DepartmentSearchInput from "./DepartmentSearchInput";
const DepartmentList = () => {
  const handleEdit = (department) => {
    addDepartmentStore.setdepartmentsData(department);
    console.log(department.departmentId, "asd");
    modelStore.setisModalOpen(true);

    // openAdddepartmentsModal();
  };
  const handleDelete = (department) => {
    departmentStore.handleDelete(department);
  };
  const handlePageChange = (page) => {
    departmentStore.setCurrentPage(page);
    departmentStore.fetchDataFromBackend();
  };
  useEffect(() => {
    const fetchData = async () => {
      departmentStore.setLoading(true);
      try {
        await departmentStore.fetchDataFromBackend();
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        departmentStore.setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchTextChange = (text) => {
    departmentStore.setSearchText(text);
  };

  const handleFilterChange = (filter) => {
    departmentStore.setSelectedFilter(filter);
  };
  return (
    <>
      {departmentStore.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="Form-list-container">
          <div className="formlist--search-end-row">
            <h2>Showing Departments</h2>
            <DepartmentSearchInput />
          </div>

          {departmentStore.isLoading ? (
            <LoadingSpinner />
          ) : !departmentStore.departments?.length ? (
            <div className="noData-container">
              <img src={NoData} alt="No Data to Show" className="noData-img" />
            </div>
          ) : (
            <div className="FormList-table">
              <table>
                <thead>
                  <tr>
                    <th>department Id</th>
                    <th>department Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStore.departments?.map((department) => (
                    <tr key={department.id}>
                      <td>{department.id}</td>
                      <td>{department.name}</td>
                      <td className="FormList-edit-icon">
                        <div
                          onClick={() => handleEdit(department)}
                          className="FormList-edit-icons"
                        >
                          <BiEditAlt className="FormList-edit-icons" />
                        </div>
                        <IoMdTrash
                          onClick={() => handleDelete(department)}
                          className="FormList-delete-icon"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <div className="FormList-pagination-header">
        <button
          onClick={() => handlePageChange(departmentStore.currentPage - 1)}
          disabled={departmentStore.currentPage === 1}
          className="FormList-pagination-button"
        >
          Prev
        </button>
        <div className="page-count">{departmentStore.currentPage}</div>
        <button
          className="FormList-pagination-button"
          onClick={() => handlePageChange(departmentStore.currentPage + 1)}
          disabled={
            departmentStore.currentPage === departmentStore.totalPages ||
            departmentStore.departments?.length === 0
          }
        >
          Next
        </button>
      </div>
    </>
  );
};

export default observer(DepartmentList);
