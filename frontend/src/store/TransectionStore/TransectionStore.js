// transectionstore.js
import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";
import axios from "axios";
import Swal from "sweetalert2";
import { addtransectionStore } from "./AddTransectionStore";
import { addstudentStore } from "../StudentsStore/AddStudentStore";

class TransectionStore {
  currentPage = 1;
  rowsPerPage = 10;
  searchText = "";
  selectedFilter = "all";
  transections = [];
  categories = [];
  departments = [];
  students = [];
  showEditModal = false;
  editingtransection = null;
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
      transections: observable,
      categories: observable,
      departments: observable,
      students: observable,
      showEditModal: observable,
      editingtransection: observable,
      mouseHover: observable,
      loading: observable,
      isLoading: observable,
      totalPages: observable,
      getCurrentPageData: computed,
      setStudentArray: action,
      fetchStudents: action,
      fetchCategorizedBooks: action,
      getDataBYCategory: action,
      getDepartments: action,
      setrowsPerPage: action,
      setSearchText: action,
      setSelectedFilter: action,
      setCurrentPage: action,
      setShowEditModal: action,
      setEditingtransection: action,
      setLoading: action,
      settransections: action,
      setTotalPages: action,
      fetchDataFromBackend: action,
      fetchCategorizedData: action,
      handleEdit: action,
      handleSaveEdit: action,
      handleCancelEdit: action,
      handleDelete: action,
    });
  }
  setStudentArray(data) {
    this.students = { ...data };
    console.log("check updated studentsssssssssss");
    console.log(data);
  }

  async fetchCategorizedBooks() {
    try {
      this.setLoading(true);
      addtransectionStore.setFormData({
        // title: "",
      });

      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/books/categories/dpts/filter",
        {
          category: addtransectionStore.formData.category,
          department: addtransectionStore.formData.department_name,
        },
        {
          headers,
        }
      );

      if (response.status === 200) {
        return response.data.books;
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      this.setLoading(false);
    } finally {
      this.setLoading(false);
    }
  }
  async fetchStudents() {
    try {
      this.setLoading(true);
      if (!addtransectionStore.editORsubmit) {
        addtransectionStore.setFormData({
          roll_no: "",
          name: "",
          phone_no: "",
        });
      }

      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/students/filter",
        {
          department_name: addtransectionStore.formData.department_name,
          batch_year: addtransectionStore.formData.batch_year,
          batch_time: addtransectionStore.formData.batch_time,
        },
        {
          headers,
        }
      );

      if (response.status === 200) {
        runInAction(() => {
          this.setStudentArray(response.data.students);
        });
        return response.data.students;
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      this.setLoading(false);
    } finally {
      this.setLoading(false);
    }
  }
  async getDepartments() {
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.get(
        "http://localhost:8080/api/departments",
        {
          headers,
        }
      );

      if (response.status === 200) {
        this.departments = response.data;
        console.log("usman,department rows", this.departments);
        console.log("usman,response", response.data);
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
    console.log("filteredtransections:", this.filteredtransections);
    return this.filteredtransections.slice(startIndex, endIndex);
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

  setEditingtransection(transection) {
    this.editingtransection = transection;
  }

  settransections(transections) {
    this.transections = transections;
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
        "http://localhost:8080/api/transections/paginate/category",
        {
          page: this.currentPage,
          page_size: this.rowsPerPage,
          category: this.FiltreCategoryName,
          search: this.searchText,
          // sortBy: "acc_no",
          sortBy: "",
          sortOrder: "",
        },
        { headers }
      );

      if (this.currentPage === 1) {
        this.transections = [];
        console.log("before updating transections", this.transections);
        this.transections = response.data.transections;
        console.log("after updating transections", this.transections);
        console.log("usman this.transections", this.transections);
      } else {
        this.transections = [];
        this.transections = [
          ...this.transections,
          ...response.data.transections,
        ];
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching transections:", error);
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
        "http://localhost:8080/api/transections/paginate",
        {
          page: this.currentPage,
          page_size: this.rowsPerPage,
          filter: this.selectedFilter,
          category: this.FiltreCategoryName ? this.FiltreCategoryName : "",
          search: this.searchText,
          // sortBy: "acc_no",
          sortBy: "",
          sortOrder: "desc",
          fine: addtransectionStore.formData.checked_fine
            ? addtransectionStore.formData.checked_fine
            : 0,
        },
        { headers }
      );

      if (this.currentPage === 1) {
        this.transections = response.data.transections;
        console.log("usman this.transections", this.transections);
      } else {
        this.transections = [];
        this.transections = [
          ...this.transections,
          ...response.data.transections,
        ];
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching transections:", error);
      this.setLoading(false);
    }
  }
  handleEdit(transection) {
    this.setShowEditModal(true);
    this.setEditingtransection(transection);
  }

  handleSaveEdit() {
    const transectionsInfo = {
      roll_no: addtransectionStore.formData.roll_no,
      name: addtransectionStore.formData.name,
      batch_year: addtransectionStore.formData.batch_year,
      batch_time: addtransectionStore.formData.batch_time,
      department_name: addtransectionStore.formData.department_name,
      category: addtransectionStore.formData.category,
      phone_no: addtransectionStore.formData.phone_no,
      title: addtransectionStore.formData.title,
      due_date: addtransectionStore.formData.due_date,
      fine: addtransectionStore.formData.fine,
    };
    const transectionId = addtransectionStore.transectionId;
    const token = localStorage.getItem("bearer token");
    const headers = {
      Authorization: `${token}`,
    };
    axios
      .put(
        `http://localhost:8080/api/transections/${transectionId}`,
        {
          roll_no: transectionsInfo.roll_no,
          name: transectionsInfo.name,
          batch_year: transectionsInfo.batch_year,
          batch_time: transectionsInfo.batch_time,
          department_name: transectionsInfo.department_name,
          category: transectionsInfo.category,
          phone_no: transectionsInfo.phone_no,
          title: transectionsInfo.title,
          due_date: transectionsInfo.due_date,
          fine: transectionsInfo.fine,
        },
        {
          headers,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const editedtransectionIndex = this.transections.findIndex(
            (t) => t.transectionId === transectionId
          );
          const updatedtransections = [...this.transections];
          updatedtransections[editedtransectionIndex] = response.data;
          this.settransections(updatedtransections);
          // addtransectionStore.fetchData();
          addtransectionStore.showAlert("Updated Successfully...");
          this.fetchDataFromBackend(1);
          addtransectionStore.clearFormFields();
        }
      })
      .catch((error) => {
        addtransectionStore.showAlert("Error while Updating...");
        addtransectionStore.clearFormFields();
        console.error("Error editing transection:", error);
      });
  }

  handleCancelEdit() {
    this.setShowEditModal(false);
    this.setEditingtransection(null);
  }

  async handleDelete(transection) {
    console.log("first,returnrrrrrrrrrrrrr", transection);
    const confirmed = await this.showConfirm(
      `Are you sure you want to delete id:${transection.id} name:${transection.name}?`
    );
    if (confirmed) {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      axios
        .delete(`http://localhost:8080/api/transections/${transection.id}`, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            const updatedtransections = this.transections.filter(
              (t) => t.transectionId !== transection.transectionId
            );
            this.settransections(updatedtransections);
            this.fetchDataFromBackend(1);
            addtransectionStore.showAlert("Transection Deleted Successfully..");
          } else {
            console.error("Error deleting transection:", response.data.message);
            addtransectionStore.showAlert("Error while deleting transection..");
          }
        })
        .catch((error) => {
          console.error("Error deleting transection:", error);
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

export const transectionStore = new TransectionStore();
