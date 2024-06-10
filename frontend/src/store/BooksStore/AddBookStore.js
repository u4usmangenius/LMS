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
    acc_no: "",
    title: "",
    author: "",
    publisher: "",
    category: "Select Category",
    remarks: "Give Remarks",
    cost: null,
    quantity: null,
  };
  clearFormFields() {
    this.formData.acc_no = "";
    this.formData.title = "";
    this.formData.author = "";
    this.formData.publisher = "";
    this.formData.category = "";
    this.formData.remarks = "";
    this.formData.cost = null;
    this.formData.quantity = null;
    validations.errors.acc_no = false;
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
    console.log(data);
  }
  setbooksData(book) {
    const data = { ...book };
    this.formData.acc_no = data.acc_no;
    this.formData.title = data.title;
    this.formData.author = data.author;
    this.formData.publisher = data.publisher;
    this.formData.category = data.category;
    this.formData.remarks = data.remarks;
    this.formData.cost = data.cost;
    this.formData.quantity = data.quantity;
    this.bookId = book.id;

    console.log("hello for now", this.formData, this.bookId);
    validations.errors.acc_no = false;
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
      console.log("first uuuuuuuuuuuuuuu", book.acc_no);
      const response = await axios.post(
        "http://localhost:8080/api/books",
        {
          acc_no: book.acc_no,
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          category: book.category,
          remarks: book.remarks,
          cost: book.cost,
          quantity: book.quantity,
          year: book.year,
          pages: book.pages,
          binding: book.binding,
        },
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
        acc_no: this.formData.acc_no,
        title: this.formData.title,
        author: this.formData.author,
        publisher: this.formData.publisher,
        category: this.formData.category,
        remarks: this.formData.remarks,
        cost: this.formData.cost,
        quantity: this.formData.quantity,
        year: 2010,
        pages: 250,
        binding: "",
      };
      console.log(book, "oooooooooooooooooooooo");
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
