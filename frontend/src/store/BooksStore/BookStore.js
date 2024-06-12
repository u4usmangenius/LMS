// bookstore.js
import { makeObservable, observable, action, computed } from "mobx";
import axios from "axios";
import Swal from "sweetalert2";
import { addbookStore } from "./AddBookStore";

class BookStore {
  currentPage = 1;
  rowsPerPage = 10;
  searchText = "";
  selectedFilter = "all";
  books = [];
  categories = [];
  showEditModal = false;
  editingbook = null;
  loading = false;
  isLoading = false;
  totalPages = 1;
  mouseHover = false;
  Category = "";
  FiltreCategoryName = "";

  constructor() {
    makeObservable(this, {
      currentPage: observable,
      rowsPerPage: observable,
      searchText: observable,
      selectedFilter: observable,
      Category: observable,
      FiltreCategoryName: observable,
      books: observable,
      categories: observable,
      showEditModal: observable,
      editingbook: observable,
      mouseHover: observable,
      loading: observable,
      isLoading: observable,
      totalPages: observable,
      getCurrentPageData: computed,
      getDataBYCategory: action,
      setrowsPerPage: action,
      setSearchText: action,
      setSelectedFilter: action,
      setCurrentPage: action,
      setShowEditModal: action,
      setEditingbook: action,
      setLoading: action,
      setbooks: action,
      setTotalPages: action,
      fetchDataFromBackend: action,
      fetchCategorizedData: action,
      handleEdit: action,
      handleSaveEdit: action,
      handleCancelEdit: action,
      handleDelete: action,
    });
  }
  async getDataBYCategory() {
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers,
      });

      if (response.status === 200) {
        this.categories = response.data;
        console.log("usman,rows", this.categories);
        console.log("usman,response", response.data);
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  get getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    console.log("startIndex:", startIndex);
    console.log("endIndex:", endIndex);
    console.log("filteredbooks:", this.filteredbooks);
    return this.filteredbooks.slice(startIndex, endIndex);
  }

  setSearchText(text) {
    this.searchText = text;
    this.Category = false;
  }

  setSelectedFilter(filter) {
    this.selectedFilter = filter;
  }

  setrowsPerPage(page) {
    this.rowsPerPage = page;
    this.fetchDataFromBackend();
    console.log(this.rowsPerPage);
  }

  setCurrentPage(page) {
    this.currentPage = page;
    this.searchText = ""; // Reset searchText when currentPage changes
  }

  setShowEditModal(show) {
    this.showEditModal = show;
  }

  setEditingbook(book) {
    this.editingbook = book;
  }

  setbooks(books) {
    this.books = books;
  }

  setTotalPages(totalPages) {
    this.totalPages = totalPages;
  }
  setLoading(isLoading) {
    this.loading = isLoading;
  }

  async fetchCategorizedData() {
    try {
      this.setLoading(true);
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/books/paginate/category",
        {
          page: this.currentPage,
          page_size: this.rowsPerPage,
          category: this.FiltreCategoryName,
          search: this.searchText,
          // sortBy: "acc_no",
          sortBy: "",
          sortOrder: "desc",
        },
        { headers }
      );

      if (this.currentPage === 1) {
        this.books = [];
        console.log("before updating books", this.books);
        this.books = response.data.books;
        console.log("after updating books", this.books);
        console.log("usman this.books", this.books);
      } else {
        this.books = [];
        this.books = [...this.books, ...response.data.books];
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching books:", error);
      this.setLoading(false);
    }
  }
  async fetchDataFromBackend(page) {
    try {
      this.setLoading(true);
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/books/paginate",
        {
          page: this.currentPage,
          pageSize: this.rowsPerPage,
          filter: this.selectedFilter,
          category: this.FiltreCategoryName ? this.FiltreCategoryName : "",
          search: this.searchText,
          // sortBy: "acc_no",
          sortBy: "",
          sortOrder: "desc",
        },
        { headers }
      );

      if (this.currentPage === 1) {
        this.books = response.data.books;
        console.log("usman this.books", this.books);
      } else {
        this.books = [];
        this.books = [...this.books, ...response.data.books];
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching books:", error);
      this.setLoading(false);
    }
  }
  handleEdit(book) {
    this.setShowEditModal(true);
    this.setEditingbook(book);
  }

  handleSaveEdit() {
    const booksInfo = {
      acc_no: addbookStore.formData.acc_no,
      title: addbookStore.formData.title,
      author: addbookStore.formData.author,
      publisher: addbookStore.formData.publisher,
      category: addbookStore.formData.category,
      remarks: addbookStore.formData.remarks,
      cost: addbookStore.formData.cost,
      quantity: addbookStore.formData.quantity,
    };
    const bookId = addbookStore.bookId;
    const token = localStorage.getItem("bearer token");
    const headers = {
      Authorization: `${token}`,
    };
    axios
      .put(
        `http://localhost:8080/api/books/${bookId}`,
        {
          acc_no: booksInfo.acc_no,
          title: booksInfo.title,
          author: booksInfo.author,
          publisher: booksInfo.publisher,
          category: booksInfo.category,
          remarks: booksInfo.remarks,
          cost: booksInfo.cost,
          quantity: booksInfo.quantity,
        },
        {
          headers,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const editedbookIndex = this.books.findIndex(
            (t) => t.bookId === bookId
          );
          const updatedbooks = [...this.books];
          updatedbooks[editedbookIndex] = response.data;
          this.setbooks(updatedbooks);
          // addbookStore.fetchData();
          addbookStore.showAlert("Updated Successfully...");
          this.fetchDataFromBackend(1);
          addbookStore.clearFormFields();
        }
      })
      .catch((error) => {
        addbookStore.showAlert("Error while Updating...");
        addbookStore.clearFormFields();
        console.error("Error editing book:", error);
      });
  }

  handleCancelEdit() {
    this.setShowEditModal(false);
    this.setEditingbook(null);
  }

  async handleDelete(book) {
    console.log("first,returnrrrrrrrrrrrrr", book);
    const confirmed = await this.showConfirm(
      `Are you sure you want to delete ${book.acc_no}?`
    );
    if (confirmed) {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      axios
        .delete(`http://localhost:8080/api/books/${book.id}`, { headers })
        .then((response) => {
          if (response.status === 200) {
            const updatedbooks = this.books.filter(
              (t) => t.bookId !== book.bookId
            );
            this.setbooks(updatedbooks);
            this.fetchDataFromBackend(1);
            addbookStore.showAlert("Book deleted successfully..");
          } else {
            console.error("Error deleting book:", response.data.message);
            addbookStore.showAlert("Error while deleting book..");
          }
        })
        .catch((error) => {
          console.error("Error deleting book:", error);
        });
    }
  }

  showConfirm(message) {
    return Swal.fire({
      title: "Confirm",
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      return result.isConfirmed;
    });
  }
}

export const bookStore = new BookStore();
