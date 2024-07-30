import { makeObservable, observable, action } from "mobx";

class Validations {
  errors = {
    roll_no: false,
    name: false,
    batch_year: false,
    batch_time: false,
    department_name: false,
    category: false,
    phone_no: false,
    title: false,
    due_date: false,
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
      roll_no: false,
      name: false,
      batch_year: false,
      batch_time: false,
      department_name: false,
      category: false,
      phone_no: false,
      title: false,
      due_date: false,
    };
    this.errors.hasError = !isValid;
    return isValid;
  }
}

export const validations = new Validations();
