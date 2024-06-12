// AddstudentStore.js
import { makeObservable, observable, action } from "mobx";
import axios from "axios";
import Papa from "papaparse";
import Swal from "sweetalert2";
import { validations } from "../../helper.js/StudentValidationStore";
import { studentStore } from "./StudentStore";

class AddstudentStore {
  showAddButton = false;
  currentPage = 1;
  rowsPerPage = 8;
  selectedOption = "manually";
  studentId = "";
  studentData = [];
  editingIndex = -1;
  editORsubmit = false;
  RestrictAddAnother = false;
  formData = {
    roll_no: null,
    name: "",
    phone_no: "",
    department_name: "Select department",
    batch_year: "Select Batch",
    batch_time: "Select Session",
    address: "",
    gender: "Select Gender",
  };
  ApiFields = {
    department_name: "",
    batch_year: "",
    batch_time: "",
  };
  clearFormFields() {
    this.formData.roll_no = null;
    this.formData.name = "";
    this.formData.address = "";
    this.formData.phone_no = "";
    this.formData.batch_year = "";
    this.formData.batch_time = "";
    this.formData.gender = "";
    this.formData.department_name = "";
    validations.errors.roll_no = false;
    validations.errors.name = false;
    validations.errors.address = false;
    validations.errors.phone_no = false;
    validations.errors.batch_year = false;
    validations.errors.batch_time = false;
    validations.errors.gender = false;
    validations.errors.department_name = false;
  }
  constructor() {
    makeObservable(this, {
      showAddButton: observable,
      currentPage: observable,
      selectedOption: observable,
      studentData: observable,
      editingIndex: observable,
      formData: observable,
      ApiFields: observable,
      editORsubmit: observable,
      RestrictAddAnother: observable,
      fetchData: action,
      setstudentsData: action,
      setFormData: action,
      setApiFields: action,
      addstudentToBackend: action,
      handleSubmit: action,
      showAlert: action,
      clearFormFields: action,
    });
  }

  setFormData(data) {
    this.formData = { ...this.formData, ...data };
    console.log(data);
  }
  setApiFields(data) {
    this.ApiFields = { ...this.ApiFields, ...data };
    console.log("ApiFields", data);
  }
  setstudentsData(student) {
    const data = { ...student };
    this.formData.roll_no = data.roll_no;
    this.formData.name = data.name;
    this.formData.address = data.address;
    this.formData.phone_no = data.phone_no;
    this.formData.batch_year = data.batch_year;
    this.formData.batch_time = data.batch_time;
    this.formData.gender = data.gender;
    this.formData.department_name = data.department_name;
    this.studentId = student.id;

    console.log("hello for now", this.formData, this.studentId);
    validations.errors.roll_no = false;
    validations.errors.name = false;
    validations.errors.address = false;
    validations.errors.phone_no = false;
    validations.errors.batch_year = false;
    validations.errors.batch_time = false;
    validations.errors.gender = false;
    validations.errors.department_name = false;
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

  addstudentToBackend = async (student) => {
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      console.log("first uuuuuuuuuuuuuuu", student.acc_no);
      const response = await axios.post(
        "http://localhost:8080/api/students",
        {
          roll_no: student.roll_no,
          name: student.name,
          address: student.address,
          phone_no: student.phone_no,
          batch_year: student.batch_year,
          batch_time: student.batch_time,
          gender: student.gender,
          department_name: student.department_name,
          image: null,
        },
        { headers }
      );

      if (response.status === 200) {
        return true; // student added successfully
      } else {
        return false; // Failed to add student
      }
    } catch (error) {
      console.error("Error adding student:", error);
      return false; // Error occurred while adding student
    }
  };

  handleSubmit = async () => {
    try {
      const student = {
        roll_no: this.formData.roll_no,
        name: this.formData.name,
        address: this.formData.address,
        phone_no: this.formData.phone_no,
        batch_year: this.formData.batch_year,
        batch_time: this.formData.batch_time,
        gender: this.formData.gender,
        department_name: this.formData.department_name,
      };
      console.log(student, "oooooooooooooooooooooo");
      const success = await this.addstudentToBackend(student);
      if (success) {
        const fetchData = async () => {
          studentStore.setLoading(true);
          try {
            //   await studentStore.fetchDataFromBackend(this.currentPage);
            await studentStore.fetchDataFromBackend(this.currentPage);
          } catch (error) {
            console.error("Error fetching subjects:", error);
          } finally {
            studentStore.setLoading(false);
          }
        };

        fetchData();

        this.clearFormFields();
        this.showAlert("student added successfully");
      } else {
        this.clearFormFields();
        this.showAlert("Failed to add student. Please try again.");
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

export const addstudentStore = new AddstudentStore();
