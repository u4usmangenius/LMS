import React, { useEffect, useRef } from "react";
import { IoMdTrash } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import LoadingSpinner from "../../components/loaders/Spinner";
import { observer } from "mobx-react-lite";
import { transectionStore } from "../../store/TransectionStore/TransectionStore";
import { addtransectionStore } from "../../store/TransectionStore/AddTransectionStore";
import NoData from "../../assests/noData.png";
import { modelStore } from "../../store/ModelStore/ModelStore";
import "../styles/FormList.css";
import TransectionSearchInput from "../Transection/TransectionSearchInput";

const DashboardList = () => {
  // below line for getting data by filter category
  const { FiltreClassName } = { ...transectionStore };

  // useEffect(() => {
  //   transectionStore.fetchDataFromBackend(1);
  // }, []);
  useEffect(() => {
    transectionStore.fetchDataFromBackend(1);
  }, [transectionStore.FiltreCategoryName]);
  useEffect(() => {
    transectionStore.getDataBYCategory();
  }, []);
  const handleEdit = (transection) => {
    addtransectionStore.settransectionsData(transection);
    console.log(transection.transectionId, "asd");
    modelStore.openModel();
  };
  const handleDelete = (transection) => {
    transectionStore.handleDelete(transection);
  };
  const handlePageChange = (page) => {
    transectionStore.setCurrentPage(page);
    transectionStore.fetchDataFromBackend();
  };

  const handleSearchTextChange = (text) => {
    transectionStore.setSearchText(text);
  };

  const handleFilterChange = (filter) => {
    transectionStore.setSelectedFilter(filter);
  };
  return (
    <>
      <div className="FormList-container-dashboard">
        <div
          className="Form-list-container Form-list-dashboard-container "
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <div className="formlist--search-end-row">
            <h2
              style={{
                marginTop: "1%",
                color: "#bbb",
                paddingBottom: "2%",
                marginLeft: "-5%",
              }}
            >
              Latest Transactions
            </h2>
            <div style={{ marginRight: "0.1%", marginTop: "-0.5%" }}>
              <TransectionSearchInput />
            </div>
          </div>
        </div>
        <div className="Form-list-container Form-list-dashboard-container">
          <div className="formlist--search-end-row"></div>

          {transectionStore.isLoading ? (
            <LoadingSpinner />
          ) : !transectionStore.transections?.length ? (
            <div className="noData-container">
              <img src={NoData} alt="No Data to Show" className="noData-img" />
            </div>
          ) : (
            <div className="FormList-table">
              <table>
                <thead>
                  <tr>
                    <th>Roll</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Batch</th>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Return Date</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {transectionStore.transections?.map((transection) => (
                    <tr key={transection.id}>
                      <td>{transection.roll_no}</td>
                      <td>{transection.name}</td>
                      <td>
                        {transection.phone_no ? transection.phone_no : "-"}
                      </td>
                      <td>{transection.department_name}</td>
                      <td>{transection.batch_year}</td>
                      <td>{transection.title}</td>
                      <td>{transection.created_at.split(" ")[0]}</td>
                      <td>{transection.due_date.split(" ")[0]}</td>
                      <td>{transection.fine ? transection.fine : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="FormList-pagination-header ">
          <button
            onClick={() => handlePageChange(transectionStore.currentPage - 1)}
            disabled={transectionStore.currentPage === 1}
            className="FormList-pagination-button"
          >
            Prev
          </button>
          <div className="page-count">{transectionStore.currentPage}</div>
          <button
            className="FormList-pagination-button"
            onClick={() => handlePageChange(transectionStore.currentPage + 1)}
            disabled={
              transectionStore.currentPage === transectionStore.totalPages ||
              transectionStore.transections?.length === 0
            }
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default observer(DashboardList);
