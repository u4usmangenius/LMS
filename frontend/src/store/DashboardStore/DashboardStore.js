// store.js
import { makeObservable, observable, action, ObservableSet } from "mobx";

import axios from "axios";
import { loginstore } from "../LoginStore/LoginStore";

class DashboardStore {
  dashboard = false;
  isDropdownOpen = false;
  loading = false;

  data = {
    totalBooks: null,
    students: null,
    transections: null,
  };
  FiltreClassName = "2nd Year";
  results = [];

  constructor() {
    makeObservable(this, {
      loading: observable,
      dashboard: observable,
      results: observable,
      FiltreClassName: observable,
      data: observable,
      isDropdownOpen: observable,
      setLoading: action,
      fetchData: action,
      setResults: action,
      getDataByClassName: action,
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
          await axios.post("http://localhost:8080/api/import", formData, {
            headers,
          });

          // Handle successful import
          // window.alert("Database imported successfully");
          // You can perform additional actions here as needed
        } catch (error) {
          console.error("Import failed:", error);
          loginstore.showWarning("Database Import Failed. Please try again."); // Show an error message to the user

          // Handle error here
        }
      }
      loginstore.showSuccss("Database Imported Successfully...");
    });

    fileInput.click();
  }

  async handleExport() {
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: token,
      };

      const response = await axios.get("http://localhost:8080/api/export", {
        headers,
        responseType: "blob",
      });

      // Get the content disposition header to determine the file name and extension
      const contentDisposition = response.headers["content-disposition"];
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);

      let filename = "Result.sqlite"; // Default to .sqlite extension

      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, ""); // Get the filename from the header
      }

      // Create an anchor element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Set the filename with the correct extension
      document.body.appendChild(link);
      link.click();
      loginstore.showSuccss("Backup is successfully done..");
    } catch (error) {
      console.error("Export failed:", error);
      loginstore.showAlert("Error while taking Backup..");
    }
  }

  async getDataByClassName() {
    this.results = [];
    const ClassName = this.FiltreClassName;
    console.log("===================");
    console.log(ClassName, "store");
    console.log("===================");
    try {
      const token = localStorage.getItem("bearer token");
      const headers = {
        Authorization: `${token}`,
      };
      const response = await axios.post(
        "http://localhost:8080/api/results/ClassName",
        { ClassName },
        {
          headers,
        }
      );

      if (response.status === 200) {
        this.results = [];

        this.setResults(response.data.data);
        console.log("--------------------------");
        console.log(this.results);
        console.log("--------------------------");
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
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
        console.log("-----------", data);

        // Access the data you need from the response
        this.data.totalBooks = data.books;
        this.data.students = data.students;
        this.data.transections = data.transections;
        console.log("start",data, data.books, data.students, data.transections,"end");
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
