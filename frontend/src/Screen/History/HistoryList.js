import React, { useEffect, useRef } from "react";
import { IoMdTrash } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import LoadingSpinner from "../../components/loaders/Spinner";
import { observer } from "mobx-react-lite";
import { historyStore } from "../../store/HistoryStore/HistoryStore";
import NoData from "../../assests/noData.png";
import { modelStore } from "../../store/ModelStore/ModelStore";
import HistorySearchInput from "./HistorySearchInput";
const HistoryList = () => {
  const handleEdit = (history) => {
    // addhistoryStore.sethistoryData(history);
    console.log(history.historyId, "asd");
    modelStore.setisModalOpen(true);

    // openAddhistoryModal();
  };
  const handleDelete = (history) => {
    historyStore.handleDelete(history);
  };
  const handlePageChange = (page) => {
    historyStore.setCurrentPage(page);
    historyStore.fetchDataFromBackend();
  };
  useEffect(() => {
    const fetchData = async () => {
      historyStore.setLoading(true);
      try {
        await historyStore.fetchDataFromBackend();
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        historyStore.setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchTextChange = (text) => {
    historyStore.setSearchText(text);
  };

  const handleFilterChange = (filter) => {
    historyStore.setSelectedFilter(filter);
  };
  return (
    <>
      {historyStore.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="Form-list-container">
          {/* <div className="formlist--search-end-row">
            <h2>Showing History</h2>
            <HistorySearchInput  />

          </div> */}

          {historyStore.isLoading ? (
            <LoadingSpinner />
          ) : !historyStore.history?.length ? (
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
                  {historyStore.history?.map((history) => (
                    <tr key={history.id}>
                      <td>{history.roll_no}</td>
                      <td>{history.name}</td>
                      <td>{history.phone_no ? history.phone_no : "-"}</td>
                      <td>{history.department_name}</td>
                      <td>{history.batch_year}</td>
                      <td>{history.title}</td>
                      <td>{history.created_at.split(" ")[0]}</td>
                      <td>{history.due_date.split(" ")[0]}</td>
                      <td>{history.fine}</td>
                      {/* <td className="FormList-edit-icon">
                        <div
                          onClick={() => handleEdit(history)}
                          className="FormList-edit-icons"
                        >
                          <BiEditAlt className="FormList-edit-icons" />
                        </div>
                        <IoMdTrash
                          onClick={() => handleDelete(history)}
                          className="FormList-delete-icon"
                        />
                      </td> */}
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
          onClick={() => handlePageChange(historyStore.currentPage - 1)}
          disabled={historyStore.currentPage === 1}
          className="FormList-pagination-button"
        >
          Prev
        </button>
        <div className="page-count">{historyStore.currentPage}</div>
        <button
          className="FormList-pagination-button"
          onClick={() => handlePageChange(historyStore.currentPage + 1)}
          disabled={
            historyStore.currentPage === historyStore.totalPages ||
            historyStore.history?.length === 0
          }
        >
          Next
        </button>
      </div>
    </>
  );
};

export default observer(HistoryList);
