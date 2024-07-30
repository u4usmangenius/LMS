// categorytore.js
import { makeObservable, observable, action, computed } from "mobx";
import axios from "axios";
import Swal from "sweetalert2";
import { addCategoryStore } from "./AddCategoryStore";

class Categorytore {
  currentPage = 1;
  rowsPerPage = 10;
  searchText = "";
  selectedFilter = "all";
  category = [];
  showEditModal = false;
  editingcategory = null;
  loading = false;
  isLoading = false;
  totalPages = 1;
  mouseHover = false;
  Category = "";

  constructor() {
    makeObservable(this, {
      currentPage: observable,
      rowsPerPage: observable,
      searchText: observable,
      selectedFilter: observable,
      Category: observable,
      category: observable,
      showEditModal: observable,
      editingcategory: observable,
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
      setEditingcategory: action,
      setLoading: action,
      setcategory: action,
      setTotalPages: action,
      fetchDataFromBackend: action,
      handleEdit: action,
      handleSaveEdit: action,
      handleCancelEdit: action,
      handleDelete: action,
    });
  }
  async getDataBYCategory() {
    const ClassName = this.Category;
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/category/ClassName",
        { ClassName },
        {
          headers,
        }
      );

      if (response.status === 200) {
        this.setcategory(response.data.data);
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
    console.log("filteredcategory:", this.filteredcategory);
    return this.filteredcategory.slice(startIndex, endIndex);
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

  setEditingcategory(category) {
    this.editingcategory = category;
  }

  setcategory(category) {
    this.category = category;
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
      const response = await axios.post(
        "http://localhost:8080/api/categories/paginate",
        {
          page: this.currentPage,
          pageSize: this.rowsPerPage,
          filter: this.selectedFilter,
          searchText: this.searchText,
          sortBy: "id",
          sortOrder: "asc",
        },
        { headers }
      );
      console
        .log
        // "response.data------------------------->usman",
        // response.data
        ();
      if (this.currentPage === 1) {
        this.category = response.data.categories;
        console.log(this.category, "------------------------->");
      } else {
        this.category = [];
        this.category = [...this.category, ...response.data.categories];
        console.log(this.category, "------------------------->");
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching category:", error);
      this.setLoading(false);
    }
  }
  handleEdit(category) {
    this.setShowEditModal(true);
    this.setEditingcategory(category);
  }

  handleSaveEdit() {
    const categoryInfo = {
      name: addCategoryStore.formData.category_Name,
      id: addCategoryStore.formData.id,
    };
    
    const token = localStorage.getItem("bearer token");
    const headers = {
      Authorization: `${token}`,
    };
    axios
      .put(
        `http://localhost:8080/api/categories/${categoryInfo.id}`,
        {
          name: categoryInfo.name,
        },
        {
          headers,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const editedcategoryIndex = this.category.findIndex(
            (t) => t.id === categoryInfo.id
          );
          const updatedcategory = [...this.category];
          updatedcategory[editedcategoryIndex] = response.data;
          this.setcategory(updatedcategory);
          // addCategoryStore.fetchData();
          addCategoryStore.showAlert("Updated Successfully...");
          this.fetchDataFromBackend(1);
          addCategoryStore.clearFormFields();
        }
      })
      .catch((error) => {
        addCategoryStore.showAlert("Error while Updating...");
        addCategoryStore.clearFormFields();
        console.error("Error editing category:", error);
      });
  }

  handleCancelEdit() {
    this.setShowEditModal(false);
    this.setEditingcategory(null);
  }

  async handleDelete(category) {
    console.log(category,";;;;;;;;;;;;;;;;;;;;")
    const confirmed = await this.showConfirm(
      `Are you sure you want to delete ${category.name}?`
    );
    if (confirmed) {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      axios
        .delete(`http://localhost:8080/api/categories/${category.id}`, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            const updatedcategory = this.category.filter(
              (t) => t.id !== category.id
            );
            this.setcategory(updatedcategory);
            this.fetchDataFromBackend(1);
            addCategoryStore.showAlert("Category deleted sSuccessfully..");
          } else {
            console.error("Error deleting category:", response.data.message);
            addCategoryStore.showAlert("Error while deleting category..");
          }
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
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

export const categoryStore = new Categorytore();
