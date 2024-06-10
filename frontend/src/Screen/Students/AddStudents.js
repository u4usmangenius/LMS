import React, { useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { observer } from "mobx-react"; // Import MobX observer
import { addstudentStore } from "../../store/StudentsStore/AddStudentStore";
import { validations } from "../../helper.js/StudentValidationStore";
import { studentStore } from "../../store/StudentsStore/StudentStore";
import InputMask from "react-input-mask";
import { modelStore } from "../../store/ModelStore/ModelStore";

const Addstudents = () => {
  useEffect(() => {
    if (
      addstudentStore.formData.roll_no ||
      addstudentStore.formData.name ||
      (addstudentStore.formData.batch_year &&
        addstudentStore.formData.batch_year !== "Select Batch") ||
      addstudentStore.formData.address ||
      (addstudentStore.formData.batch_time &&
        addstudentStore.formData.batch_time !== "Select Session") ||
      (addstudentStore.formData.department_name &&
        addstudentStore.formData.department_name !== "Select department") ||
      (addstudentStore.formData.gender &&
        addstudentStore.formData.gender !== "Select department") ||
      addstudentStore.formData.phone_no
    ) {
      addstudentStore.editORsubmit = true;
      addstudentStore.RestrictAddAnother = true;
    } else {
      addstudentStore.editORsubmit = false;
      addstudentStore.RestrictAddAnother = false;
    }
    // addstudentStore.fetchData();
    studentStore.getDataBYDepartments();
  }, []);
  const handleAddAnotherClick = () => {
    if (addstudentStore.RestrictAddAnother) {
      return;
    }
    validations.errors.roll_no = false;
    validations.errors.name = false;
    validations.errors.address = false;
    validations.errors.phone_no = false;
    validations.errors.batch_year = false;
    validations.errors.batch_time = false;
    validations.errors.gender = false;
    validations.errors.department_name = false;
    addstudentStore.clearFormFields();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !addstudentStore.formData.department_name?.trim() ||
      !addstudentStore.formData.name?.trim() ||
      !addstudentStore.formData.address?.trim() ||
      //   !addstudentStore.formData.phone_no?.trim() ||
      !addstudentStore.formData.batch_year?.trim() ||
      !addstudentStore.formData.batch_time?.trim() ||
      !addstudentStore.formData.gender?.trim() ||
      !addstudentStore.formData?.roll_no
    ) {
      validations.errors.roll_no = true;
      validations.errors.name = true;
      validations.errors.address = true;
      validations.errors.phone_no = true;
      validations.errors.batch_year = true;
      validations.errors.batch_time = true;
      validations.errors.gender = true;
      validations.errors.department_name = true;
      return;
    }
    if (addstudentStore.formData.batch_year === "Select Batch") {
      validations.errors.batch_year = true;
      return;
    } else if (addstudentStore.formData.batch_time === "Select Session") {
      validations.errors.batch_time = true;
      return;
    } else {
      if (addstudentStore.editORsubmit) {
        studentStore.handleSaveEdit();
      } else {
        addstudentStore.handleSubmit();
      }
      modelStore.closeModel();
    }
  };

  return (
    <div className="add-form-content">
      <h2 className="add-form-heading">Categories</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.roll_no && !addstudentStore.formData.roll_no
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Roll No
              {validations.errors.roll_no &&
                !addstudentStore.formData.roll_no && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="number"
              className="addForm-input-type-text"
              placeholder="Enter student roll no"
              value={addstudentStore.formData.roll_no}
              onChange={(e) => {
                let value = parseInt(e.target.value);
                console.log("-->", value);
                addstudentStore.setFormData({ roll_no: value });
              }}
            />
          </div>

          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.name &&
                addstudentStore.formData.name?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Name
              {validations.errors.name &&
                addstudentStore.formData.name?.trim() === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              placeholder="Enter name"
              value={addstudentStore.formData.name}
              onChange={(e) => {
                let value = e.target.value;
                addstudentStore.setFormData({ name: value });
              }}
            />
          </div>
          <div className="add-form-group">
            <label className={`addForm-input-label`}>Phone</label>
            <InputMask
              mask="+92-999-9999999"
              maskChar=""
              type="text"
              className="addForm-input-type-text"
              placeholder="+92-999-9999999"
              value={
                addstudentStore.formData.phone_no.startsWith("+92-")
                  ? addstudentStore.formData.phone_no
                  : "+92-" + addstudentStore.formData.phone_no
              }
              onChange={(e) =>
                addstudentStore.setFormData({ phone_no: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.preventDefault();
                  const updatedValue = addstudentStore.formData.phone_no.slice(
                    0,
                    -1
                  );
                  addstudentStore.setFormData({ phone_no: updatedValue });
                }
              }}
            />
          </div>
        </div>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.department_name &&
                (addstudentStore.formData.department_name?.trim() ===
                  "Select department" ||
                  addstudentStore.formData.department_name?.trim() === "")
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Department
              {validations.errors.department_name &&
                (addstudentStore.formData.department_name?.trim() ===
                  "Select department" ||
                  addstudentStore.formData.department_name?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addstudentStore.formData.department_name}
              className="addForm-input-select"
              onChange={(e) =>
                addstudentStore.setFormData({ department_name: e.target.value })
              }
            >
              <option>Select department</option>
              {studentStore.departments?.map((categories, index) => (
                <option key={index} value={categories.name}>
                  {categories.name}
                </option>
              ))}
            </select>
          </div>

          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.batch_year &&
                (addstudentStore.formData.batch_year?.trim() ===
                  "Select Batch" ||
                  addstudentStore.formData.batch_year?.trim() === "")
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Batch
              {validations.errors.batch_year &&
                (addstudentStore.formData.batch_year?.trim() ===
                  "Select Batch" ||
                  addstudentStore.formData.batch_year?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addstudentStore.formData.batch_year}
              className="addForm-input-select"
              onChange={(e) =>
                addstudentStore.setFormData({ batch_year: e.target.value })
              }
            >
              <option>Select Batch</option>
              <option>2019-2023</option>
              <option>2020-2024</option>
              <option>2021-2025</option>
              <option>2022-2026</option>
              <option>2023-2027</option>
              <option>2024-2028</option>
              <option>2025-2029</option>
              <option>2026-2030</option>
              <option>2027-2031</option>
              <option>2028-2032</option>
              <option>2029-2033</option>
              <option>2030-2034</option>
              <option>2031-2035</option>
            </select>
          </div>
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.batch_time &&
                (addstudentStore.formData.batch_time?.trim() ===
                  "Select Session" ||
                  addstudentStore.formData.batch_time?.trim() === "")
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Session
              {validations.errors.batch_time &&
                (addstudentStore.formData.batch_time?.trim() ===
                  "Select Session" ||
                  addstudentStore.formData.batch_time?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addstudentStore.formData.batch_time}
              className="addForm-input-select"
              onChange={(e) =>
                addstudentStore.setFormData({ batch_time: e.target.value })
              }
            >
              <option>Select Session</option>
              <option>Morning</option>
              <option>Evening</option>
            </select>
          </div>
        </div>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.gender &&
                (addstudentStore.formData.gender?.trim() === "Select Gender" ||
                  addstudentStore.formData.gender?.trim() === "")
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Gender
              {validations.errors.gender &&
                (addstudentStore.formData.gender?.trim() === "Select Gender" ||
                  addstudentStore.formData.gender?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addstudentStore.formData.gender}
              className="addForm-input-select"
              onChange={(e) =>
                addstudentStore.setFormData({ gender: e.target.value })
              }
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.address &&
                addstudentStore.formData.address === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Address
              {validations.errors.address &&
                addstudentStore.formData.address === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              placeholder="Enter address"
              value={addstudentStore.formData.address}
              onChange={(e) => {
                let value = e.target.value;
                addstudentStore.setFormData({ address: value });
              }}
            />
          </div>
        </div>

        <div className="addForm-another-btn">
          <div
            className="add-another-form-text"
            onClick={handleAddAnotherClick}
            disabled={addstudentStore.RestrictAddAnother === true}
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
            {addstudentStore.RestrictAddAnother === true
              ? "Update Now"
              : "Add Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default observer(Addstudents);
