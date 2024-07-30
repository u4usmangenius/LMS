import React, { useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { observer } from "mobx-react"; // Import MobX observer
import { addbookStore } from "../../store/BooksStore/AddBookStore";
import { validations } from "../../helper.js/BooksValidationStore";
import { bookStore } from "../../store/BooksStore/BookStore";
import InputMask from "react-input-mask";
import { modelStore } from "../../store/ModelStore/ModelStore";

const AddBooks = () => {
  useEffect(() => {
    if (
      addbookStore.formData.acc_no ||
      addbookStore.formData.author ||
      (addbookStore.formData.category &&
        addbookStore.formData.category !== "Select Category") ||
      addbookStore.formData.publisher ||
      (addbookStore.formData.remarks &&
        addbookStore.formData.remarks !== "Give Remarks") ||
      addbookStore.formData.title ||
      addbookStore.formData.cost ||
      addbookStore.formData.quantity
    ) {
      addbookStore.editORsubmit = true;
      addbookStore.RestrictAddAnother = true;
    } else {
      addbookStore.editORsubmit = false;
      addbookStore.RestrictAddAnother = false;
    }
    // addbookStore.fetchData();
    bookStore.getDataBYCategory();
  }, []);
  useEffect(() => {
    const fun = async () => {
      await bookStore.getDataBYDepartments();
    };
    fun();
  }, []);
  const handleAddAnotherClick = () => {
    if (addbookStore.RestrictAddAnother) {
      return;
    }
    validations.errors.ClassName = false;
    validations.errors.SubjectName = false;
    validations.errors.TestName = false;
    validations.errors.TotalMarks = false;
    addbookStore.clearFormFields();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !addbookStore.formData.acc_no?.trim() ||
      !addbookStore.formData.title?.trim() ||
      !addbookStore.formData.author?.trim() ||
      !addbookStore.formData.publisher?.trim() ||
      !addbookStore.formData.category?.trim() ||
      !addbookStore.formData.remarks?.trim() ||
      !addbookStore.formData.cost ||
      !addbookStore.formData.quantity
    ) {
      validations.errors.acc_no = true;
      validations.errors.title = true;
      validations.errors.author = true;
      validations.errors.publisher = true;
      validations.errors.category = true;
      validations.errors.remarks = true;
      validations.errors.cost = true;
      validations.errors.quantity = true;
      return;
    }
    if (addbookStore.formData.category === "Select Category") {
      validations.errors.category = true;
      return;
    } else {
      if (addbookStore.editORsubmit) {
        bookStore.handleSaveEdit();
      } else {
        addbookStore.handleSubmit();
      }
      modelStore.closeModel();
    }
  };

  return (
    <div className="add-form-content">
      <h2 className="add-form-heading">Books</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                (validations.errors.category &&
                  addbookStore.formData.category?.trim() ===
                    "Select Category") ||
                addbookStore.formData.category?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Category
              {validations.errors.category &&
                (addbookStore.formData.category?.trim() === "Select Category" ||
                  addbookStore.formData.category?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addbookStore.formData.category}
              className="addForm-input-select"
              onChange={(e) =>
                addbookStore.setFormData({ category: e.target.value })
              }
            >
              <option>Select Category</option>
              {bookStore.categories?.map((categories, index) => (
                <option key={index} value={categories.name}>
                  {categories.name}
                </option>
              ))}
            </select>
          </div>
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.acc_no &&
                addbookStore.formData.acc_no?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              acc_no
              {validations.errors.acc_no &&
                addbookStore.formData.acc_no?.trim() === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              placeholder="Enter acc_no"
              value={addbookStore.formData.acc_no}
              onChange={(e) => {
                let value = e.target.value;
                addbookStore.setFormData({ acc_no: value });
              }}
            />
          </div>
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                (validations.errors.remarks &&
                  addbookStore.formData.remarks?.trim() === "Give Remarks") ||
                addbookStore.formData.remarks?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Remarks
              {validations.errors.remarks &&
                (addbookStore.formData.remarks?.trim() === "Give Remarks" ||
                  addbookStore.formData.remarks?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addbookStore.formData.remarks}
              className="addForm-input-select"
              onChange={(e) =>
                addbookStore.setFormData({ remarks: e.target.value })
              }
            >
              <option>Give Remarks</option>
              <option>Normal</option>
              <option>Good</option>
              <option>Bad</option>
            </select>
          </div>
        </div>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.title &&
                addbookStore.formData.title?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Title
              {validations.errors.title &&
                addbookStore.formData.title?.trim() === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              placeholder="Enter book title"
              value={addbookStore.formData.title}
              onChange={(e) =>
                addbookStore.setFormData({ title: e.target.value })
              }
            />
          </div>
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.author &&
                addbookStore.formData.author?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Author
              {validations.errors.author &&
                addbookStore.formData.author?.trim() === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              placeholder="Enter author name"
              value={addbookStore.formData.author}
              onChange={(e) =>
                addbookStore.setFormData({ author: e.target.value })
              }
            />
          </div>

          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.publisher &&
                addbookStore.formData.publisher?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Publisher
              {validations.errors.publisher &&
                addbookStore.formData.publisher?.trim() === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              placeholder="Enter publisher name"
              value={addbookStore.formData.publisher}
              onChange={(e) =>
                addbookStore.setFormData({ publisher: e.target.value })
              }
            />
          </div>
        </div>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.department &&
                validations.formData.department !== "Select Department" &&
                addbookStore.formData.department === null
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Department
              {validations.errors.department &&
                validations.formData.department !== "Select Department" &&
                addbookStore.formData.department === null && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addbookStore.formData.department}
              className="addForm-input-select"
              onChange={(e) =>
                addbookStore.setFormData({ department: e.target.value })
              }
            >
              <option>Select Department</option>
              {bookStore.departments?.map((department, index) => (
                <option key={index} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.quantity &&
                addbookStore.formData.quantity === null
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Quantity
              {validations.errors.quantity &&
                addbookStore.formData.quantity === null && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="number"
              className="addForm-input-type-text"
              placeholder="Enter quantity"
              value={addbookStore.formData.quantity}
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  addbookStore.setFormData({ quantity: value });
                } else {
                  if (e.target.value <= 999999999999999)
                    addbookStore.setFormData({ quantity: null });
                }
              }}
            />
          </div>
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.cost && addbookStore.formData.cost === null
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Cost
              {validations.errors.cost &&
                addbookStore.formData.cost === null && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="number"
              className="addForm-input-type-text"
              placeholder="Enter cost of book"
              value={addbookStore.formData.cost}
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  addbookStore.setFormData({ cost: value });
                } else {
                  if (e.target.value <= 999999999999999)
                    addbookStore.setFormData({ cost: null });
                }
              }}
            />
          </div>
        </div>

        <div className="addForm-another-btn">
          <div
            className="add-another-form-text"
            onClick={handleAddAnotherClick}
            disabled={addbookStore.RestrictAddAnother === true}
          >
            <div className="add-another-text-icon-btn">
              <IoMdAddCircle />
            </div>
            Add Another
          </div>
          <button
            type="submit"
            className="add-form-button"
            onClick={handleSubmit}
          >
            {addbookStore.RestrictAddAnother === true
              ? "Update Now"
              : "Add Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default observer(AddBooks);
