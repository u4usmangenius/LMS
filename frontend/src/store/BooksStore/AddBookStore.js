// AddbookStore.js
import { makeObservable, observable, action } from "mobx";
import axios from "axios";
import Papa from "papaparse";
import Swal from "sweetalert2";
import { validations } from "../../helper.js/BooksValidationStore";
import { bookStore } from "./BookStore";

class AddbookStore {
  showAddButton = false;
  currentPage = 1;
  rowsPerPage = 8;
  selectedOption = "manually";
  bookId = "";
  bookData = [];
  editingIndex = -1;
  editORsubmit = false;
  RestrictAddAnother = false;
  formData = {
    aac_no: "",
    title: "",
    author: "",
    publisher: "",
    category: "",
    remarks: "",
    cost: null,
    quantity: null,
  };
  clearFormFields() {
    this.formData.aac_no = "";
    this.formData.title = "";
    this.formData.author = "";
    this.formData.publisher = "";
    this.formData.category = "";
    this.formData.remarks = "";
    this.formData.cost = null;
    this.formData.quantity = null;
    validations.errors.aac_no = false;
    validations.errors.title = false;
    validations.errors.author = false;
    validations.errors.publisher = false;
    validations.errors.category = false;
    validations.errors.remarks = false;
    validations.errors.cost = false;
    validations.errors.quantity = false;
  }
  constructor() {
    makeObservable(this, {
      showAddButton: observable,
      currentPage: observable,
      selectedOption: observable,
      bookData: observable,
      editingIndex: observable,
      formData: observable,
      editORsubmit: observable,
      RestrictAddAnother: observable,
      fetchData: action,
      setbooksData: action,
      setFormData: action,
      addbookToBackend: action,
      handleSubmit: action,
      showAlert: action,
      clearFormFields: action,
    });
  }

  setFormData(data) {
    this.formData = { ...this.formData, ...data };
  }
  setbooksData(book) {
    const data = { ...book };
    this.formData.aac_no = data.aac_no;
    this.formData.title = data.title;
    this.formData.author = data.author;
    this.formData.publisher = data.publisher;
    this.formData.category = data.category;
    this.formData.remarks = data.remarks;
    this.formData.cost = data.cost;
    this.formData.quantity = data.quantity;
    this.bookId = book.bookId;

    validations.errors.aac_no = false;
    validations.errors.title = false;
    validations.errors.author = false;
    validations.errors.publisher = false;
    validations.errors.category = false;
    validations.errors.remarks = false;
    validations.errors.cost = false;
    validations.errors.quantity = false;
  }

  // Define the showAlert action
  showAlert(message) {
    Swal.fire(message);
  }

  fetchData = async () => {
    const token = localStorage.getItem("bearer token");
    const headers = {
      Authorization: `${token}`,
    };

    try {
      const response = await axios.get("http://localhost:8080/api/students", {
        headers,
      });
      if (response.status === 200) {
        const { students } = response.data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  addbookToBackend = async (book) => {
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/books",
        book,
        { headers }
      );

      if (response.status === 200) {
        return true; // book added successfully
      } else {
        return false; // Failed to add book
      }
    } catch (error) {
      console.error("Error adding book:", error);
      return false; // Error occurred while adding book
    }
  };

  handleSubmit = async () => {
    try {
      const book = {
        aac_no: this.formData.aac_no,
        title: this.formData.title,
        author: this.formData.author,
        publisher: this.formData.publisher,
        category: this.formData.category,
        remarks: this.formData.remarks,
        cost: this.formData.cost,
        quantity: this.formData.quantity,
      };
      const success = await this.addbookToBackend(book);
      if (success) {
        const fetchData = async () => {
          bookStore.setLoading(true);
          try {
            //   await bookStore.fetchDataFromBackend(this.currentPage);
            await bookStore.fetchDataFromBackend(this.currentPage);
          } catch (error) {
            console.error("Error fetching subjects:", error);
          } finally {
            bookStore.setLoading(false);
          }
        };

        fetchData();

        this.clearFormFields();
        this.showAlert("book added successfully");
      } else {
        this.clearFormFields();
        this.showAlert("Failed to add book. Please try again.");
      }
    } catch (error) {
      console.error("Error handling submit:", error);
      this.showAlert("An error occurred while processing the request.");
      this.clearFormFields();
    }
  };

  showConfirm = (message) => {
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
  };
}

export const addbookStore = new AddbookStore();
