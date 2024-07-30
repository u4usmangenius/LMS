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
import TransectionSearchInput from "./TransectionSearchInput";

const TransectionList = () => {
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
  const handleFineChange = (e) => {
    if (e.target.checked) {
      addtransectionStore.setFormData({
        checked_fine: 5,
        // checked_fine: e.target.value,
      });
      transectionStore.fetchDataFromBackend();
    } else {
      addtransectionStore.setFormData({
        checked_fine: 0,
      });
      transectionStore.fetchDataFromBackend();
    }
    console.log(addtransectionStore.formData.checked_fine, "-------------MMM");
  };
  const Checkmark = ({ size, color }) => (
    <div style={{ fontSize: size, color: color }}>✔</div>
  );

  const Cross = ({ size, color }) => (
    <div style={{ fontSize: size, color: color }}>✘</div>
  );
  return (
    <>
      <div className="Form-list-container">
        <div className="formlist--search-end-row">
          <label
            // className=""

            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              // border: "0.3px solid #000",
            }}
          >
            <div
              className="FormList-pagination-button"
              style={{
                backgroundColor: "#2c3e50",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                fontSize: "15px",
                // width: "110px",
                // border: "0.3px solid #000",
                cursor: "pointer",
                fontWeight:"bold"
                ,letterSpacing:"0px"
              }}
            >
              Fine 
              {addtransectionStore.formData.checked_fine ? (
                <Checkmark size="24px" color="blue" />
              ) : (
                // <Cross size="24px" color="red" />
                ""
              )}
            </div>
            <input
              type="checkbox"
              onChange={handleFineChange}
              style={{
                width: "40px",
                height: "20px",
                cursor: "pointer",
                display: "none",
              }}
            />
          </label>
          <TransectionSearchInput />
        </div>

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transectionStore.transections?.map((transection) => (
                  <tr key={transection.id}>
                    <td>{transection.roll_no}</td>
                    <td>{transection.name}</td>
                    <td>{transection.phone_no ? transection.phone_no : "-"}</td>
                    <td>{transection.department_name}</td>
                    <td>{transection.batch_year}</td>
                    <td>{transection.title}</td>
                    <td>{transection.created_at.split(" ")[0]}</td>
                    <td>{transection.due_date.split(" ")[0]}</td>
                    <td>{transection.fine ? transection.fine : "-"}</td>
                    <td className="FormList-edit-icon">
                      <div
                        onClick={() => handleEdit(transection)}
                        className="FormList-edit-icons"
                      >
                        <BiEditAlt className="FormList-edit-icons" />
                      </div>
                      <IoMdTrash
                        onClick={() => handleDelete(transection)}
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
      <div className="FormList-pagination-header">
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
    </>
  );
};

export default observer(TransectionList);
