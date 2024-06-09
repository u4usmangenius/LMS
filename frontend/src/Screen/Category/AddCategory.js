import React, { useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { observer } from "mobx-react"; // Import MobX observer
import { addCategoryStore } from "../../store/CategoryStore/AddCategoryStore";
import { validations } from "../../helper.js/CategoryValidationStore";
import { categoryStore } from "../../store/CategoryStore/CategoryStore";
import InputMask from "react-input-mask";
import "../styles/AddForm.css";
import { modelStore } from "../../store/ModelStore/ModelStore";
const AddCategory = ({ onClose }) => {
  useEffect(() => {
    if (addCategoryStore.formData.category_Name) {
      addCategoryStore.editORsubmit = true;
      addCategoryStore.RestrictAddAnother = true;
    } else {
      addCategoryStore.editORsubmit = false;
      addCategoryStore.RestrictAddAnother = false;
    }
  }, []);
  const handleAddAnotherClick = () => {
    if (addCategoryStore.RestrictAddAnother) {
      return;
    }
    validations.errors.category_Name = false;
    addCategoryStore.clearFormFields();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addCategoryStore.formData.category_Name.trim()) {
      validations.errors.category_Name = true;
      return;
    }
    if (addCategoryStore.formData.category_Name === "Select Category") {
      validations.errors.category_Name = true;
      return;
    } else {
      if (addCategoryStore.editORsubmit) {
        categoryStore.handleSaveEdit();
      } else {
        addCategoryStore.handleSubmit();
      }
      modelStore.closeModel(true);
    }
  };

  return (
    <div className="add-form-content">
      <h2 className="add-form-heading">Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.category_Name &&
                addCategoryStore.formData.category_Name.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Category
              {validations.errors.category_Name &&
                addCategoryStore.formData.category_Name.trim() === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              placeholder="Category Name"
              value={addCategoryStore.formData.category_Name}
              onChange={(e) => {
                addCategoryStore.setFormData({ category_Name: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="addForm-another-btn">
          <div
            className="add-another-form-text"
            onClick={handleAddAnotherClick}
            disabled={addCategoryStore.RestrictAddAnother === true}
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
            {addCategoryStore.RestrictAddAnother === true
              ? "Update Now"
              : "Add Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default observer(AddCategory);
