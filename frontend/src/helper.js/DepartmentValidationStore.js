import { makeObservable, observable, action } from "mobx";

class Validations {
  errors = {
    department_Name: false,
  };
  constructor() {
    makeObservable(this, {
      errors: observable,
      validateForm: action,
    });
  }
  setEditedFields(newFields) {
    this.editedFields = newFields;
  }
  validateForm() {
    let isValid = true;
    this.errors = {
      department_Name: false,
    };
    this.errors.hasError = !isValid;
    return isValid;
  }
}

export const validations = new Validations();
