// store.js
import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";
import axios from "axios";
class LoginStore {
  formFields = {
    username: "",// admin
    password: "",// admin
  };

  errors = {
    username: "",
    password: "",
  };
  auth = "";
  logoutUser = null;
  userExists = false;
  constructor() {
    makeObservable(this, {
      userExists: observable,
      formFields: observable,
      errors: observable,
      auth: observable,
      logoutUser: observable,
      setFormField: action,
      clearFormFields: action,
      setError: action,
      showAlert: action,
      showWarning: action,
      showSuccss: action,
      setUserExists: action,
    });
  }

  setFormField(field, value) {
    this.formFields[field] = value;
  }
  setUserExists(value) {
    this.userExists = value;
  }
  showAlert(message) {
    Swal.fire({
      text: message,
      icon: "error",
    });
  }
  showWarning(message) {
    Swal.fire({
      text: message,
      icon: "warning",
    });
  }
  showSuccss(message) {
    Swal.fire({
      text: message,
      icon: "success",
    });
  }

  clearFormFields() {
    this.formFields = {
      username: "",
      password: "",
    };
  }

  setError(field, error) {
    this.errors[field] = error;
  }
}

export const loginstore = new LoginStore();
