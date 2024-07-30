// AdddepartmentStore.js
import { makeObservable, observable, action } from "mobx";
import axios from "axios";
import Papa from "papaparse";
import Swal from "sweetalert2";
import { validations } from "../../helper.js/DepartmentValidationStore";
import { departmentStore } from "./DepartmentStore";

class AddDepartmentStore {
  showAddButton = false;
  currentPage = 1;
  rowsPerPage = 8;
  selectedOption = "manually";
  departmentId = "";
  departmentData = [];
  editingIndex = -1;
  editORsubmit = false;
  RestrictAddAnother = false;
  formData = {
    department_Name: "",
  };
  clearFormFields() {
    this.formData.department_Name = "";
    validations.errors.department_Name = false;
  }
  constructor() {
    makeObservable(this, {
      showAddButton: observable,
      currentPage: observable,
      selectedOption: observable,
      departmentData: observable,
      editingIndex: observable,
      formData: observable,
      editORsubmit: observable,
      RestrictAddAnother: observable,
      fetchData: action,
      setdepartmentsData: action,
      setFormData: action,
      adddepartmentToBackend: action,
      handleSubmit: action,
      showAlert: action,
      clearFormFields: action,
    });
  }

  setFormData(data) {
    this.formData = { ...this.formData, ...data };
    console.log(data);
  }
  setdepartmentsData(department) {
    const data = { ...department };
    this.formData.department_Name = data.name;
    this.departmentId = department.id;
    console.log("hello for now", this.formData, this.departmentId);
    validations.errors.department_Name = false;
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

  adddepartmentToBackend = async (department) => {
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      console.log("first uuuuuuuuuuuuuuu", department.acc_no);
      const response = await axios.post(
        "http://localhost:8080/api/departments",
        {
          name: department.name,
        },
        { headers }
      );

      if (response.status === 200) {
        return true; // department added successfully
      } else {
        return false; // Failed to add department
      }
    } catch (error) {
      console.error("Error adding department:", error);
      return false; // Error occurred while adding department
    }
  };

  handleSubmit = async () => {
    try {
      const department = {
        name: this.formData.department_Name,
      };
      console.log(department, "oooooooooooooooooooooo");
      const success = await this.adddepartmentToBackend(department);
      if (success) {
        const fetchData = async () => {
          departmentStore.setLoading(true);
          try {
            //   await departmentStore.fetchDataFromBackend(this.currentPage);
            await departmentStore.fetchDataFromBackend(this.currentPage);
          } catch (error) {
            console.error("Error fetching subjects:", error);
          } finally {
            departmentStore.setLoading(false);
          }
        };

        fetchData();

        this.clearFormFields();
        this.showAlert("department added successfully");
      } else {
        this.clearFormFields();
        this.showAlert("Failed to add department. Please try again.");
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

export const addDepartmentStore = new AddDepartmentStore();
