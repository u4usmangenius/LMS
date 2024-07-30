import React, { useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { observer } from "mobx-react"; // Import MobX observer
import { addtransectionStore } from "../../store/TransectionStore/AddTransectionStore";
import { validations } from "../../helper.js/TransectionValidationStore";
import { transectionStore } from "../../store/TransectionStore/TransectionStore";
import InputMask from "react-input-mask";
import { modelStore } from "../../store/ModelStore/ModelStore";

const AddStdTransectionForm = () => {
  return (
    <>
      <div className="add-form-content">
        <h2 className="add-form-heading">Transection</h2>
        <form
        // onSubmit={handleSubmit}
        >
          <div className="add-form-row">
            <div className="add-form-group">
              <label
                className={`addForm-input-label ${
                  validations.errors.title &&
                  addtransectionStore.formData.title?.trim() === ""
                    ? "steric-error-msg"
                    : "normal-label"
                }`}
              >
                Title
                {validations.errors.title &&
                  addtransectionStore.formData.title?.trim() === "" && (
                    <span className="steric-error-msg"> *</span>
                  )}
              </label>
              <input
                type="text"
                className="addForm-input-type-text"
                placeholder="Enter transection title"
                value={addtransectionStore.formData.title}
                onChange={(e) =>
                  addtransectionStore.setFormData({ title: e.target.value })
                }
              />
            </div>
            <div className="add-form-group">
              <label
                className={`addForm-input-label ${
                  validations.errors.author &&
                  addtransectionStore.formData.author?.trim() === ""
                    ? "steric-error-msg"
                    : "normal-label"
                }`}
              >
                Author
                {validations.errors.author &&
                  addtransectionStore.formData.author?.trim() === "" && (
                    <span className="steric-error-msg"> *</span>
                  )}
              </label>
              <input
                type="text"
                className="addForm-input-type-text"
                placeholder="Enter author name"
                value={addtransectionStore.formData.author}
                onChange={(e) =>
                  addtransectionStore.setFormData({ author: e.target.value })
                }
              />
            </div>
            <div className="add-form-row">
              <div className="add-form-group">
                <label
                  className={`addForm-input-label ${
                    validations.errors.publisher &&
                    addtransectionStore.formData.publisher?.trim() === ""
                      ? "steric-error-msg"
                      : "normal-label"
                  }`}
                >
                  Publisher
                  {validations.errors.publisher &&
                    addtransectionStore.formData.publisher?.trim() === "" && (
                      <span className="steric-error-msg"> *</span>
                    )}
                </label>
                <input
                  type="text"
                  className="addForm-input-type-text"
                  placeholder="Enter publisher name"
                  value={addtransectionStore.formData.publisher}
                  onChange={(e) =>
                    addtransectionStore.setFormData({
                      publisher: e.target.value,
                    })
                  }
                />
              </div>
              <div className="add-form-group">
                <label
                  className={`addForm-input-label ${
                    validations.errors.quantity &&
                    addtransectionStore.formData.quantity === null
                      ? "steric-error-msg"
                      : "normal-label"
                  }`}
                >
                  Quantity
                  {validations.errors.quantity &&
                    addtransectionStore.formData.quantity === null && (
                      <span className="steric-error-msg"> *</span>
                    )}
                </label>
                <input
                  type="number"
                  className="addForm-input-type-text"
                  placeholder="Enter quantity"
                  value={addtransectionStore.formData.quantity}
                  onChange={(e) => {
                    let value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      addtransectionStore.setFormData({ quantity: value });
                    } else {
                      if (e.target.value <= 999999999999999)
                        addtransectionStore.setFormData({ quantity: null });
                    }
                  }}
                />
              </div>
            </div>
            <div className="add-form-row">
              <div className="add-form-group">
                <label
                  className={`addForm-input-label ${
                    validations.errors.cost &&
                    addtransectionStore.formData.cost === null
                      ? "steric-error-msg"
                      : "normal-label"
                  }`}
                >
                  Cost
                  {validations.errors.cost &&
                    addtransectionStore.formData.cost === null && (
                      <span className="steric-error-msg"> *</span>
                    )}
                </label>
                <input
                  type="number"
                  className="addForm-input-type-text"
                  placeholder="Enter cost of transection"
                  value={addtransectionStore.formData.cost}
                  onChange={(e) => {
                    let value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      addtransectionStore.setFormData({ cost: value });
                    } else {
                      if (e.target.value <= 999999999999999)
                        addtransectionStore.setFormData({ cost: null });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddStdTransectionForm;
