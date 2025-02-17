import React, { useEffect } from "react";
import "./Modal.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { addbookStore } from "../../store/BooksStore/AddBookStore.js";
import { modelStore } from "../../store/ModelStore/ModelStore.js";
import { addCategoryStore } from "../../store/CategoryStore/AddCategoryStore.js";
import { addDepartmentStore } from "../../store/DepartmentStore/AddDepartmentStore.js";
import { addstudentStore } from "../../store/StudentsStore/AddStudentStore.js";
import { addtransectionStore } from "../../store/TransectionStore/AddTransectionStore.js";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleOnClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOnClose = () => {
    if (modelStore.isStd_ImgModalOpen) {
      modelStore.close_stdImageModal();
      return;
    }

    addCategoryStore.clearFormFields();
    addbookStore.clearFormFields();
    addDepartmentStore.clearFormFields();
    addstudentStore.clearFormFields();
    addtransectionStore.clearFormFields();
    // add others for clearn for their form fields(clearformfields)

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-modal-button" onClick={handleOnClose}>
          <div className="teacher-close-icon">
            <AiFillCloseCircle />
          </div>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
