import React, { useEffect, useRef } from "react";
import { IoMdTrash } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import LoadingSpinner from "../../components/loaders/Spinner";
import { observer } from "mobx-react-lite";
import { categoryStore } from "../../store/CategoryStore/CategoryStore";
import { addCategoryStore } from "../../store/CategoryStore/AddCategoryStore";
import NoData from "../../assests/noData.png";
import SearchInput from "./CategorySearchInput";
import CategorySearchInput from "./CategorySearchInput";
import { modelStore } from "../../store/ModelStore/ModelStore";

const CategoryList = () => {
  const handleEdit = (category) => {
    addCategoryStore.setcategorysData(category);
    console.log(category.categoryId, "asd");
    modelStore.setisModalOpen(true);

    // openAddcategorysModal();
  };
  const handleDelete = (category) => {
    categoryStore.handleDelete(category);
  };
  const handlePageChange = (page) => {
    categoryStore.setCurrentPage(page);
    categoryStore.fetchDataFromBackend();
  };
  useEffect(() => {
    const fetchData = async () => {
      categoryStore.setLoading(true);
      try {
        await categoryStore.fetchDataFromBackend();
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        categoryStore.setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchTextChange = (text) => {
    categoryStore.setSearchText(text);
  };

  const handleFilterChange = (filter) => {
    categoryStore.setSelectedFilter(filter);
  };
  return (
    <>
      {categoryStore.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="Form-list-container">
          <div className="formlist--search-end-row">
            <h2>Showing Categories</h2>
            <CategorySearchInput />
          </div>

          {categoryStore.isLoading ? (
            <LoadingSpinner />
          ) : !categoryStore.category?.length ? (
            <div className="noData-container">
              <img src={NoData} alt="No Data to Show" className="noData-img" />
            </div>
          ) : (
            <div className="FormList-table">
              <table>
                <thead>
                  <tr>
                    <th>Category Id</th>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryStore.category?.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td className="FormList-edit-icon">
                        <div
                          onClick={() => handleEdit(category)}
                          className="FormList-edit-icons"
                        >
                          <BiEditAlt className="FormList-edit-icons" />
                        </div>
                        <IoMdTrash
                          onClick={() => handleDelete(category)}
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
          onClick={() => handlePageChange(categoryStore.currentPage - 1)}
          disabled={categoryStore.currentPage === 1}
          className="FormList-pagination-button"
        >
          Prev
        </button>
        <div className="page-count">{categoryStore.currentPage}</div>
        <button
          className="FormList-pagination-button"
          onClick={() => handlePageChange(categoryStore.currentPage + 1)}
          disabled={
            categoryStore.currentPage === categoryStore.totalPages ||
            categoryStore.category?.length === 0
          }
        >
          Next
        </button>
      </div>
    </>
  );
};

export default observer(CategoryList);
