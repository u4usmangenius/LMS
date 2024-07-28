// AddtransectionStore.js
import { makeObservable, observable, action } from "mobx";
import axios from "axios";
import Papa from "papaparse";
import Swal from "sweetalert2";
import { validations } from "../../helper.js/TransectionValidationStore";
import { transectionStore } from "./TransectionStore";

class AddtransectionStore {
  showAddButton = false;
  currentPage = 1;
  rowsPerPage = 8;
  selectedOption = "manually";
  transectionId = "";
  transectionData = [];
  editingIndex = -1;
  editORsubmit = false;
  RestrictAddAnother = false;
  formData = {
    roll_no: "Select RollNo",
    name: "",
    batch_year: "Select Batch",
    batch_time: "Select Session",
    department_name: "Select Department",
    category: "Select Category",
    phone_no: "",
    title: "",
    due_date: null,
    fine: null,
    checked_fine: null,
    book_id: null,
    book_quantity: null,
  };
  clearFormFields() {
    this.formData.roll_no = null;
    this.formData.name = "";
    this.formData.batch_year = "Select Batch";
    this.formData.batch_time = "Select Session";
    this.formData.department_name = "Select Department";
    this.formData.category = "Select Category";
    this.formData.phone_no = "";
    this.formData.title = "";
    this.formData.due_date = null;
    this.formData.book_id = null;
    this.formData.book_quantity = null;
    validations.errors.roll_no = false;
    validations.errors.name = false;
    validations.errors.batch_year = false;
    validations.errors.batch_time = false;
    validations.errors.department_name = false;
    validations.errors.category = false;
    validations.errors.phone_no = false;
    validations.errors.title = false;
    validations.errors.due_date = false;
  }
  constructor() {
    makeObservable(this, {
      showAddButton: observable,
      currentPage: observable,
      selectedOption: observable,
      transectionData: observable,
      editingIndex: observable,
      formData: observable,
      editORsubmit: observable,
      RestrictAddAnother: observable,
      fetchData: action,
      getCurrentDatePlus14Days: action,
      settransectionsData: action,
      setFormData: action,
      addtransectionToBackend: action,
      handleSubmit: action,
      showAlert: action,
      clearFormFields: action,
    });
  }

  setFormData(data) {
    this.formData = { ...this.formData, ...data };
    console.log(data);
  }
  settransectionsData(transection) {
    const data = { ...transection };
    this.formData.roll_no = data.roll_no;
    this.formData.name = data.name;
    this.formData.batch_year = data.batch_year;
    this.formData.batch_time = data.batch_time;
    this.formData.department_name = data.department_name;
    this.formData.category = data.category;
    this.formData.phone_no = data.phone_no;
    this.formData.title = data.title;
    this.formData.due_date = data.due_date;
    this.formData.fine = data.fine;
    this.transectionId = transection.id;

    console.log("hello for now", this.formData, this.transectionId);
    validations.errors.roll_no = false;
    validations.errors.name = false;
    validations.errors.batch_year = false;
    validations.errors.batch_time = false;
    validations.errors.department_name = false;
    validations.errors.category = false;
    validations.errors.phone_no = false;
    validations.errors.title = false;
    validations.errors.due_date = false;
  }

  // Define the showAlert action
  showAlert(message) {
    Swal.fire(message);
  }

  // dont use asyn in below funciton as it is sync and will cause to send object
  getCurrentDatePlus14Days() {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 14);
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
    const day = String(futureDate.getDate()).padStart(2, "0");

    const formattedFutureDate = `${year}-${month}-${day}`;

    return formattedFutureDate;
  }

  // Example usage:

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

  addtransectionToBackend = async () => {
    try {
      const datePlus14Days = this.getCurrentDatePlus14Days();
      console.log("Current date plus 14 days:", datePlus14Days);

      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/transections",
        {
          roll_no: addtransectionStore.formData?.roll_no,
          name: addtransectionStore.formData?.name,
          batch_year: addtransectionStore.formData?.batch_year,
          batch_time: addtransectionStore.formData?.batch_time,
          department_name: addtransectionStore.formData?.department_name,
          category: addtransectionStore.formData?.category,
          phone_no: addtransectionStore.formData?.phone_no,
          title: addtransectionStore.formData?.title,
          due_date: datePlus14Days,
          fine: null,
        },
        { headers }
      );

      if (response.status === 200) {
        return true; // transection added successfully
      } else {
        return false; // Failed to add transection
      }
    } catch (error) {
      console.error("Error adding transection:", error);
      return false; // Error occurred while adding transection
    }
  };

  handleSubmit = async () => {
    try {
      if (addtransectionStore.formData.book_quantity <= 0) {
        this.showAlert(`Shortage of Book quantity, contact us later`);
        addtransectionStore.clearFormFields();
        return;
      }
      const success = await this.addtransectionToBackend();
      if (success) {
        const fetchData = async () => {
          transectionStore.setLoading(true);
          try {
            //   await transectionStore.fetchDataFromBackend(this.currentPage);
            await transectionStore.fetchDataFromBackend(this.currentPage);
          } catch (error) {
            console.error("Error fetching subjects:", error);
          } finally {
            transectionStore.setLoading(false);
          }
        };

        fetchData();

        this.clearFormFields();
        this.showAlert("Transection Processed Successfully");
      } else {
        this.clearFormFields();
        this.showAlert("Failed to add transection. Please try again.");
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

export const addtransectionStore = new AddtransectionStore();
