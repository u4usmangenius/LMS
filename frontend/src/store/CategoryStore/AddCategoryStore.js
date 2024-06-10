// AddcategoryStore.js
import { makeObservable, observable, action } from "mobx";
import axios from "axios";
import Papa from "papaparse";
import Swal from "sweetalert2";
import { categoryStore } from "./CategoryStore";
import { validations } from "../../helper.js/CategoryValidationStore";

class AddcategoryStore {
  showAddButton = false;
  currentPage = 1;
  rowsPerPage = 8;
  selectedOption = "manually";
  categoryId = "";
  categoryData = [];
  editingIndex = -1;
  subjectOptions = [];
  classnameOptions = [];
  editORsubmit = false;
  RestrictAddAnother = false;
  formData = {
    category_Name: "",
    id: null,
  };
  clearFormFields() {
    this.formData.category_Name = "";
    this.formData.id = "";
    validations.errors.category_Name = false;
  }
  constructor() {
    makeObservable(this, {
      showAddButton: observable,
      currentPage: observable,
      selectedOption: observable,
      categoryData: observable,
      editingIndex: observable,
      subjectOptions: observable,
      classnameOptions: observable,
      formData: observable,
      editORsubmit: observable,
      RestrictAddAnother: observable,
      fetchData: action,
      setFormData: action,
      setSubjectOptions: action,
      setClassNameOptions: action,
      addcategoryToBackend: action,
      fetchSubjects: action,
      handleSubmit: action,
      showAlert: action,
      clearFormFields: action,
    });
  }

  setClassNameOptions(classNames) {
    this.classnameOptions = classNames;
  }

  setSubjectOptions(subjects) {
    this.subjectOptions = subjects;
  }
  setFormData(data) {
    console.log(data);
    this.formData = { ...this.formData, ...data };
  }
  setcategorysData(category) {
    const data = { ...category };
    addCategoryStore.formData.category_Name = data.name;
    addCategoryStore.formData.id = category.id;
    console.log(this.formData.category_Name, this.categoryId,"usman",category);
    validations.errors.category_Name = false;
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
        const uniqueClassNames = [
          ...new Set(students.map((student) => student.className)),
        ];
        this.setClassNameOptions(uniqueClassNames);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchSubjects = async () => {
    const token = localStorage.getItem("bearer token");
    const headers = {
      Authorization: `${token}`,
    };
    try {
      const response = await axios.get("http://localhost:8080/api/subjects", {
        headers,
      });
      if (response.status === 200) {
        const { subjects } = response.data;
        this.setSubjectOptions(subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  addcategoryToBackend = async (name) => {
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/categories",
        { name },
        { headers }
      );

      console.log("response add wala", response);
      if (response.status === 200) {
        return true; // category added successfully
      } else {
        return false; // Failed to add category
      }
    } catch (error) {
      console.error("Error adding category:", error);
      return false; // Error occurred while adding category
    }
  };

  handleSubmit = async () => {
    try {
      let category_Name = this.formData.category_Name;
      const success = await this.addcategoryToBackend(category_Name);
      if (success) {
        const fetchData = async () => {
          categoryStore.setLoading(true);
          try {
            //   await categoryStore.fetchDataFromBackend(this.currentPage);
            await categoryStore.fetchDataFromBackend(this.currentPage);
          } catch (error) {
            console.error("Error fetching subjects:", error);
          } finally {
            categoryStore.setLoading(false);
          }
        };

        fetchData();

        this.clearFormFields();
        this.showAlert("category added successfully");
      } else {
        this.clearFormFields();
        this.showAlert("Failed to add category. Please try again.");
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

export const addCategoryStore = new AddcategoryStore();
