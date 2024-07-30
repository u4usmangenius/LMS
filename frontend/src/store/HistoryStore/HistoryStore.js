// historytore.js
import { makeObservable, observable, action, computed } from "mobx";
import axios from "axios";
import Swal from "sweetalert2";

class Historytore {
  currentPage = 1;
  rowsPerPage = 10;
  searchText = "";
  selectedFilter = "all";
  history = [];
  showEditModal = false;
  editinghistory = null;
  loading = false;
  isLoading = false;
  totalPages = 1;
  mouseHover = false;

  constructor() {
    makeObservable(this, {
      currentPage: observable,
      rowsPerPage: observable,
      searchText: observable,
      selectedFilter: observable,
      history: observable,
      history: observable,
      showEditModal: observable,
      editinghistory: observable,
      mouseHover: observable,
      loading: observable,
      isLoading: observable,
      totalPages: observable,
      getCurrentPageData: computed,
      getDataBYhistory: action,
      setrowsPerPage: action,
      setSearchText: action,
      setSelectedFilter: action,
      setCurrentPage: action,
      setShowEditModal: action,
      setEditinghistory: action,
      setLoading: action,
      sethistory: action,
      setTotalPages: action,
      fetchDataFromBackend: action,
      handleEdit: action,
      handleSaveEdit: action,
      handleCancelEdit: action,
      handleDelete: action,
    });
  }
  async getDataBYhistory() {
    const ClassName = this.history;
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/history/ClassName",
        { ClassName },
        {
          headers,
        }
      );

      if (response.status === 200) {
        this.sethistory(response.data.data);
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
    console.log("filteredhistory:", this.filteredhistory);
    return this.filteredhistory.slice(startIndex, endIndex);
  }

  setSearchText(text) {
    this.searchText = text;
    this.history = false;
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

  setEditinghistory(history) {
    this.editinghistory = history;
  }

  sethistory(history) {
    this.history = history;
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
        "http://localhost:8080/api/history/paginate",
        {
          page: this.currentPage,
          pageSize: this.rowsPerPage,
          filter: this.selectedFilter,
          search: this.searchText,
          sortBy: "roll_no",
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
        this.history = response.data.history;
        console.log(this.history, "------------------------->");
      } else {
        this.history = [];
        this.history = [...this.history, ...response.data.history];
        console.log(this.history, "------------------------->");
      }
      this.totalPages = response.data.totalPages;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching history:", error);
      this.setLoading(false);
    }
  }
  handleEdit(history) {
    this.setShowEditModal(true);
    this.setEditinghistory(history);
  }

  handleSaveEdit() {
    const historyInfo = {
    //   name: addhistoryStore.formData.history_Name,
    //   id: addhistoryStore.formData.id,
    };
    
    const token = localStorage.getItem("bearer token");
    const headers = {
      Authorization: `${token}`,
    };
    axios
      .put(
        `http://localhost:8080/api/history/${historyInfo.id}`,
        {
          name: historyInfo.name,
        },
        {
          headers,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const editedhistoryIndex = this.history.findIndex(
            (t) => t.id === historyInfo.id
          );
          const updatedhistory = [...this.history];
          updatedhistory[editedhistoryIndex] = response.data;
          this.sethistory(updatedhistory);
          // addhistoryStore.fetchData();
        //   addhistoryStore.showAlert("Updated Successfully...");
          this.fetchDataFromBackend(1);
        //   addhistoryStore.clearFormFields();
        }
      })
      .catch((error) => {
        // addhistoryStore.showAlert("Error while Updating...");
        // addhistoryStore.clearFormFields();
        console.error("Error editing history:", error);
      });
  }

  handleCancelEdit() {
    this.setShowEditModal(false);
    this.setEditinghistory(null);
  }

  async handleDelete(history) {
    console.log(history,";;;;;;;;;;;;;;;;;;;;")
    const confirmed = await this.showConfirm(
      `Are you sure you want to delete ${history.name}?`
    );
    if (confirmed) {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      axios
        .delete(`http://localhost:8080/api/history/${history.id}`, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            const updatedhistory = this.history.filter(
              (t) => t.id !== history.id
            );
            this.sethistory(updatedhistory);
            this.fetchDataFromBackend(1);
            // addhistoryStore.showAlert("history Deleted Successfully..");
          } else {
            console.error("Error deleting history:", response.data.message);
            // addhistoryStore.showAlert("Error while deleting history..");
          }
        })
        .catch((error) => {
          console.error("Error deleting history:", error);
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

export const historyStore = new Historytore();
