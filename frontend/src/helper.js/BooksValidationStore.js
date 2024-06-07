import { makeObservable, observable, action } from "mobx";

class Validations {
  errors = {
    phone: false,
    gender: false,
    subject: false,
    hasError: false,
    fullName: false,
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
      phone: false,
      gender: false,
      subject: false,
      hasError: false,
      fullName: false,
    };
    this.errors.hasError = !isValid;
    return isValid;
  }
}

export const validations = new Validations();
