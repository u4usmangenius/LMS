import { makeObservable, observable, action } from "mobx";

class Validations {
  errors = {
    department: false,
    aac_no: false,
    title: false,
    author: false,
    publisher: false,
    category: false,
    cost: false,
    quantity: false,
    remarks: false,
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
      department: false,
      aac_no: false,
      title: false,
      author: false,
      publisher: false,
      category: false,
      cost: false,
      quantity: false,
      remarks: false,
    };
    this.errors.hasError = !isValid;
    return isValid;
  }
}

export const validations = new Validations();
