// store.js
import { makeObservable, observable, action, ObservableSet } from "mobx";

import axios from "axios";
import { loginstore } from "../LoginStore/LoginStore";

class DashboardStore {
  dashboard = false;
  isDropdownOpen = false;
  loading = false;
  counts = [];
  data = {
    totalBooks: "",
    students: "",
    transections: "",
  };
  FiltreClassName = "2nd Year";
  results = [];

  constructor() {
    makeObservable(this, {
      counts: observable,
      loading: observable,
      dashboard: observable,
      results: observable,
      FiltreClassName: observable,
      data: observable,
      isDropdownOpen: observable,
      setLoading: action,
      fetchData: action,
      setResults: action,
      handleExport: action,
      handleImport: action,
    });
  }
  setLoading(loading) {
    this.loading = loading;
  }

  setResults(results) {
    this.results = results;
  }
  async handleImport() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".sqlite";

    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];

      if (file) {
        const formData = new FormData();
        formData.append("importedDB", file);

        try {
          const token = localStorage.getItem("bearer token");
          const headers = {
            Authorization: token,
          };

          // Make an Axios POST request to the import API
          const response = await axios.post(
            "http://localhost:8080/api/import",
            formData,
            {
              headers,
            }
          );

          // Handle successful import
          if (response.status === 200) {
            // loginstore.showSuccss("Database imported successfully");
            console.log("Database imported successfully");
          } else {
            loginstore.showAlert(
              `Importing Database failed, with code: ${response.status}`
            );
          } // loginstore.showSuccess("Database Imported Successfully...");
        } catch (error) {
          console.error("Import failed:", error);
          // if (error.response && error.response.status === 409) {
          //   loginstore.showAlert(
          //     "Database is currently in use, cannot replace."
          //   );
          // } else {
          loginstore.showWarning("Failed to Import Database.");
          // }
        }
      }
    });

    fileInput.click();
  }

  async handleExport() {
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: token,
      };

      // Fetch the file from the server
      const response = await fetch("http://localhost:8080/api/export", {
        headers,
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = "Library.sqlite"; // Set the default file name
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Notify success after the download is triggered
      loginstore.showSuccss("Database export download started successfully.");
    } catch (error) {
      console.error("Export failed:", error);

      // Check for specific error cases
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Response error:", error.response.data);
        loginstore.showAlert(
          `Error: ${error.response.status} - ${error.response.data.message}`
        );
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Request error:", error.request);
        loginstore.showAlert("No response received from server.");
      } else {
        // Something else caused the error
        console.error("Error:", error.message);
        loginstore.showAlert("An unexpected error occurred.");
      }
    }
  }

  async fetchData() {
    this.setLoading(true);
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      // Replace 'http://localhost:3000' with the actual URL of your Express server
      const response = await axios.get(
        "http://localhost:8080/api/dashboard/counts",
        {
          headers,
        }
      );

      if (response.status === 200) {
        const data = response.data.counts;
        this.counts = data;
        console.log("-----------", data);

        // Access the data you need from the response
        this.data.totalBooks = this.counts.books;
        this.data.students = this.counts.students;
        this.data.transections = this.counts.transections;
        console.log(
          "start",
          data,
          data.books,
          data.students,
          data.transections,
          "end"
        );
        // Do something with the data (e.g., update the UI)
      } else {
        console.error("Failed to fetch data:", response.status);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
    this.setLoading(false);
  }
}

export const dashboardStore = new DashboardStore();
