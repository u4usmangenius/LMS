import React, { useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { observer } from "mobx-react"; // Import MobX observer
import { addDepartmentStore } from "../../store/DepartmentStore/AddDepartmentStore";
import { validations } from "../../helper.js/DepartmentValidationStore";
import { departmentStore } from "../../store/DepartmentStore/DepartmentStore";
import { modelStore } from "../../store/ModelStore/ModelStore";
import "../styles/AddForm.css";
const Adddepartment = () => {
  useEffect(() => {
    if (addDepartmentStore.formData.department_Name) {
      addDepartmentStore.editORsubmit = true;
      addDepartmentStore.RestrictAddAnother = true;
    } else {
      addDepartmentStore.editORsubmit = false;
      addDepartmentStore.RestrictAddAnother = false;
    }
  }, []);
  const handleAddAnotherClick = () => {
    if (addDepartmentStore.RestrictAddAnother) {
      return;
    }
    validations.errors.department_Name = false;
    addDepartmentStore.clearFormFields();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addDepartmentStore.formData.department_Name.trim()) {
      validations.errors.department_Name = true;
      return;
    }
    if (addDepartmentStore.formData.department_Name === "Select department") {
      validations.errors.department_Name = true;
      return;
    } else {
      if (addDepartmentStore.editORsubmit) {
        departmentStore.handleSaveEdit();
      } else {
        addDepartmentStore.handleSubmit();
      }
      modelStore.closeModel(true);
    }
  };

  return (
    <div className="add-form-content">
      <h2 className="add-form-heading">Add Department</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.department_Name &&
                addDepartmentStore.formData.department_Name.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Name
              {validations.errors.department_Name &&
                addDepartmentStore.formData.department_Name.trim() === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              placeholder="Enter department name"
              value={addDepartmentStore.formData.department_Name}
              onChange={(e) => {
                addDepartmentStore.setFormData({ department_Name: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="addForm-another-btn">
          <div
            className="add-another-form-text"
            onClick={handleAddAnotherClick}
            disabled={addDepartmentStore.RestrictAddAnother === true}
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
            {addDepartmentStore.RestrictAddAnother === true
              ? "Update Now"
              : "Add Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default observer(Adddepartment);
