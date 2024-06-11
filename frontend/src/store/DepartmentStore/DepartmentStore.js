// departmentstore.js
import { makeObservable, observable, action, computed } from "mobx";
import axios from "axios";
import Swal from "sweetalert2";
import { addDepartmentStore } from "./AddDepartmentStore";

class DepartmentStore {
  currentPage = 1;
  rowsPerPage = 10;
  searchText = "";
  selectedFilter = "all";
  departments = [];
  categories = [];
  showEditModal = false;
  editingdepartment = null;
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
      departments: observable,
      categories: observable,
      showEditModal: observable,
      editingdepartment: observable,
      mouseHover: observable,
      loading: observable,
      isLoading: observable,
      totalPages: observable,
      getCurrentPageData: computed,
      setrowsPerPage: action,
      setSearchText: action,
      setSelectedFilter: action,
      setCurrentPage: action,
      setShowEditModal: action,
      setEditingdepartment: action,
      setLoading: action,
      setdepartments: action,
      setTotalPages: action,
      fetchDataFromBackend: action,
      handleEdit: action,
      handleSaveEdit: action,
      handleCancelEdit: action,
      handleDelete: action,
    });
  }

  get getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    console.log("startIndex:", startIndex);
    console.log("endIndex:", endIndex);
    console.log("filtereddepartments:", this.filtereddepartments);
    return this.filtereddepartments.slice(startIndex, endIndex);
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

  setEditingdepartment(department) {
    this.editingdepartment = department;
  }

  setdepartments(departments) {
    this.departments = departments;
  }

  setTotalPages(totalPages) {
    this.totalPages = totalPages;
  }
  setLoading(isLoading) {
    this.loading = isLoading;
  }

  async fetchDataFromBackend(page) {
    try {
      this.setLoading(true);
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      console.log("seeeeeeeeeeeeeeeeeeerch txt",this.searchText)
      const response = await axios.post(
        "http://localhost:8080/api/departments/paginate",
        {
          page: this.currentPage,
          pageSize: this.rowsPerPage,
          filter: this.selectedFilter,
          category: this.FiltreCategoryName,
          searchText: this.searchText,
          // sortBy: "acc_no",
          sortBy: "id",
          sortOrder: "asc",
        },
        { headers }
      );

      if (this.currentPage === 1) {
        this.departments = response.data.departments;
        console.log("usman this.departments", this.departments);
        console.log(this.departments[0])
      } else {
        this.departments = [];
        this.departments = [...this.departments, ...response.data.departments];
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching departments:", error);
      this.setLoading(false);
    }
  }
  handleEdit(department) {
    this.setShowEditModal(true);
    this.setEditingdepartment(department);
  }

  handleSaveEdit() {
    const departmentsInfo = {
      name: addDepartmentStore.formData.department_Name,
    };
    const departmentId = addDepartmentStore.departmentId;
    const token = localStorage.getItem("bearer token");
    const headers = {
      Authorization: `${token}`,
    };
    axios
      .put(
        `http://localhost:8080/api/departments/${departmentId}`,
        {
          name: departmentsInfo.name,
        },
        {
          headers,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const editeddepartmentIndex = this.departments.findIndex(
            (t) => t.departmentId === departmentId
          );
          const updateddepartments = [...this.departments];
          updateddepartments[editeddepartmentIndex] = response.data;
          this.setdepartments(updateddepartments);
          // addDepartmentStore.fetchData();
          addDepartmentStore.showAlert("Updated Successfully...");
          this.fetchDataFromBackend(1);
          addDepartmentStore.clearFormFields();
        }
      })
      .catch((error) => {
        addDepartmentStore.showAlert("Error while Updating...");
        addDepartmentStore.clearFormFields();
        console.error("Error editing department:", error);
      });
  }

  handleCancelEdit() {
    this.setShowEditModal(false);
    this.setEditingdepartment(null);
  }

  async handleDelete(department) {
    console.log("first,returnrrrrrrrrrrrrr", department);
    const confirmed = await this.showConfirm(
      `Are you sure you want to delete ${department.acc_no}?`
    );
    if (confirmed) {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      axios
        .delete(`http://localhost:8080/api/departments/${department.id}`, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            const updateddepartments = this.departments.filter(
              (t) => t.departmentId !== department.departmentId
            );
            this.setdepartments(updateddepartments);
            this.fetchDataFromBackend(1);
            addDepartmentStore.showAlert("department Deleted Successfully..");
          } else {
            console.error("Error deleting department:", response.data.message);
            addDepartmentStore.showAlert("Error while deleting department..");
          }
        })
        .catch((error) => {
          console.error("Error deleting department:", error);
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

export const departmentStore = new DepartmentStore();
