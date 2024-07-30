// StudentStore.js
import { makeObservable, observable, action, computed } from "mobx";
import axios from "axios";
import Swal from "sweetalert2";
import { addstudentStore } from "./AddStudentStore";

class StudentStore {
  currentPage = 1;
  rowsPerPage = 10;
  searchText = "";
  selectedFilter = "all";
  students = [];
  departments = [];
  showEditModal = false;
  editingstudent = null;
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
      students: observable,
      departments: observable,
      showEditModal: observable,
      editingstudent: observable,
      mouseHover: observable,
      loading: observable,
      isLoading: observable,
      totalPages: observable,
      getCurrentPageData: computed,
      getDataBYDepartments: action,
      setrowsPerPage: action,
      setSearchText: action,
      setSelectedFilter: action,
      setCurrentPage: action,
      setShowEditModal: action,
      setEditingstudent: action,
      setLoading: action,
      setstudents: action,
      setTotalPages: action,
      fetchDataFromBackend: action,
      fetchCategorizedData: action,
      handleEdit: action,
      handleSaveEdit: action,
      handleCancelEdit: action,
      handleDelete: action,
    });
  }
  async getDataBYDepartments() {
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
        console.log("usman,rows,departments", this.departments);
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
    console.log("filteredstudents:", this.filteredstudents);
    return this.filteredstudents.slice(startIndex, endIndex);
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

  setEditingstudent(student) {
    this.editingstudent = student;
  }

  setstudents(students) {
    this.students = students;
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
        "http://localhost:8080/api/students/paginate/category",
        {
          page: this.currentPage,
          page_size: this.rowsPerPage,
          category: this.FiltreCategoryName,
          search: this.searchText,
          // sortBy: "acc_no",
          //   sortBy: "batch_year",
          sortBy: "roll_no",
          sortOrder: "asc",
        },
        { headers }
      );

      if (this.currentPage === 1) {
        this.students = [];
        console.log("before updating students", this.students);
        this.students = response.data.students;
        console.log("after updating students", this.students);
        console.log("usman this.students", this.students);
      } else {
        this.students = [];
        this.students = [...this.students, ...response.data.students];
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching students:", error);
      this.setLoading(false);
    }
  }
  async fetchDataFromBackend(page) {
    try {
      this.setLoading(true);
      let dpt_name = addstudentStore.ApiFields.department_name;
      let batch_time = addstudentStore.ApiFields.batch_time;
      let batch_year = addstudentStore.ApiFields.batch_year;

      if (dpt_name === "Select department") {
        dpt_name = "";
      }

      if (batch_year === "Select Batch") {
        batch_year = "";
      }

      if (batch_time === "Select Session") {
        batch_time = "";
      }

      console.log("usman---------->", dpt_name);
      console.log("usman---------->", batch_time);
      console.log("usman---------->", batch_year);
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/students/paginate",
        {
          page: this.currentPage,
          pageSize: this.rowsPerPage,
          filter: this.selectedFilter,
          department_name: dpt_name ? dpt_name : "",
          batch_time: batch_time ? batch_time : "",
          batch_year: batch_year ? batch_year : "",
          search: this.searchText,
          // sortBy: "acc_no",
          sortBy: "id",
          sortOrder: "asc",
        },
        { headers }
      );

      if (this.currentPage === 1) {
        this.students = response.data.students;
        console.log("usman this.students", this.students);
      } else {
        this.students = [];
        this.students = [...this.students, ...response.data.students];
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching students:", error);
      this.setLoading(false);
    }
  }
  handleEdit(student) {
    this.setShowEditModal(true);
    this.setEditingstudent(student);
  }

  handleSaveEdit() {
    const studentsInfo = {
      roll_no: addstudentStore.formData.roll_no,
      name: addstudentStore.formData.name,
      address: addstudentStore.formData.address,
      phone_no: addstudentStore.formData.phone_no,
      batch_year: addstudentStore.formData.batch_year,
      batch_time: addstudentStore.formData.batch_time,
      gender: addstudentStore.formData.gender,
      department_name: addstudentStore.formData.department_name,
    };
    const studentId = addstudentStore.studentId;
    const token = localStorage.getItem("bearer token");
    const headers = {
      Authorization: `${token}`,
    };
    axios
      .put(
        `http://localhost:8080/api/students/${studentId}`,
        {
          roll_no: studentsInfo.roll_no,
          name: studentsInfo.name,
          address: studentsInfo.address,
          phone_no: studentsInfo.phone_no,
          batch_year: studentsInfo.batch_year,
          batch_time: studentsInfo.batch_time,
          gender: studentsInfo.gender,
          department_name: studentsInfo.department_name,
        },
        {
          headers,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const editedstudentIndex = this.students.findIndex(
            (t) => t.studentId === studentId
          );
          const updatedstudents = [...this.students];
          updatedstudents[editedstudentIndex] = response.data;
          this.setstudents(updatedstudents);
          // addstudentStore.fetchData();
          addstudentStore.showAlert("Updated Successfully...");
          this.fetchDataFromBackend(1);
          addstudentStore.clearFormFields();
        }
      })
      .catch((error) => {
        addstudentStore.showAlert("Error while Updating...");
        addstudentStore.clearFormFields();
        console.error("Error editing student:", error);
      });
  }

  handleCancelEdit() {
    this.setShowEditModal(false);
    this.setEditingstudent(null);
  }

  async handleDelete(student) {
    console.log("first,returnrrrrrrrrrrrrr", student);
    const confirmed = await this.showConfirm(
      `Are you sure you want to delete Roll No:${student.id} name: ${student.name}?`
    );
    if (confirmed) {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      axios
        .delete(`http://localhost:8080/api/students/${student.id}`, { headers })
        .then((response) => {
          if (response.status === 200) {
            const updatedstudents = this.students.filter(
              (t) => t.studentId !== student.studentId
            );
            this.setstudents(updatedstudents);
            this.fetchDataFromBackend(1);
            addstudentStore.showAlert("Student deleted Successfully..");
          } else {
            console.error("Error deleting student:", response.data.message);
            addstudentStore.showAlert("Error while deleting student..");
          }
        })
        .catch((error) => {
          console.error("Error deleting student:", error);
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

export const studentStore = new StudentStore();
