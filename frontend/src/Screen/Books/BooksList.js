import React, { useEffect, useRef } from "react";
import { IoMdTrash } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import LoadingSpinner from "../../components/loaders/Spinner";
import { observer } from "mobx-react-lite";
import { bookStore } from "../../store/BooksStore/BookStore";
import "../styles/FormList.css";
import { addbookStore } from "../../store/BooksStore/AddBookStore";
import NoData from "../../assests/noData.png";
import { modelStore } from "../../store/ModelStore/ModelStore";
import BookSearchInput from "./BookSearchInput";

const BookList = () => {
  // below line for getting data by filter category
  const { FiltreClassName } = { ...bookStore };

  // useEffect(() => {
  //   bookStore.fetchDataFromBackend(1);
  // }, []);
  useEffect(() => {
    bookStore.fetchDataFromBackend(1);
  }, [bookStore.FiltreCategoryName]);
  useEffect(() => {
    bookStore.getDataBYCategory();
  }, []);
  const handleEdit = (book) => {
    addbookStore.setbooksData(book);
    console.log(book.bookId, "asd");
    modelStore.openModel();
  };
  const handleDelete = (book) => {
    bookStore.handleDelete(book);
  };
  const handlePageChange = (page) => {
    bookStore.setCurrentPage(page);
    bookStore.fetchDataFromBackend();
  };

  const handleSearchTextChange = (text) => {
    bookStore.setSearchText(text);
  };

  const handleFilterChange = (filter) => {
    bookStore.setSelectedFilter(filter);
  };
  return (
    <>
      <div className="Form-list-container">
        <div className="formlist--search-row">
          {/* show categories filter */}
          <div className="Form-search-bar">
            <select
              className="Form-filter-ClassName"
              value={bookStore.FiltreCategoryName}
              onChange={(e) => {
                bookStore.FiltreCategoryName = e.target.value;
                console.log(
                  bookStore.FiltreCategoryName,
                  "-------------------"
                );
              }}
            >
              <option value="">Categories</option>
              {bookStore.categories?.map((categories, index) => (
                <option key={index} value={categories.name}>
                  {categories.name}
                </option>
              ))}
            </select>
          </div>
          <BookSearchInput />
        </div>

        {bookStore.isLoading ? (
          <LoadingSpinner />
        ) : !bookStore.books?.length ? (
          <div className="noData-container">
            <img src={NoData} alt="No Data to Show" className="noData-img" />
          </div>
        ) : (
          <div className="FormList-table">
            <table>
              <thead>
                <tr>
                  <th>Acc_no</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Category</th>
                  <th>Remarks</th>
                  <th>Cost</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookStore.books?.map((book) => (
                  <tr key={book.id}>
                    <td>{book.acc_no}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publisher}</td>
                    <td>{book.category}</td>
                    <td>{book.remarks}</td>
                    <td>{book.cost}</td>
                    <td>{book.quantity}</td>
                    <td className="FormList-edit-icon">
                      <div
                        onClick={() => handleEdit(book)}
                        className="FormList-edit-icons"
                      >
                        <BiEditAlt className="FormList-edit-icons" />
                      </div>
                      <IoMdTrash
                        onClick={() => handleDelete(book)}
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
          onClick={() => handlePageChange(bookStore.currentPage - 1)}
          disabled={bookStore.currentPage === 1}
          className="FormList-pagination-button"
        >
          Prev
        </button>
        <div className="page-count">{bookStore.currentPage}</div>
        <button
          className="FormList-pagination-button"
          onClick={() => handlePageChange(bookStore.currentPage + 1)}
          disabled={bookStore.currentPage === bookStore.totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default observer(BookList);
