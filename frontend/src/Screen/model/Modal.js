import React, { useEffect } from "react";
import "./Modal.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { addSubjectStore } from "../../store/subjectsStore/addsubjectstore";
import { validations } from "../../helper.js/SubjectValidationStore";
import { addstudentStore } from "../../store/studentsStore/AddstudentsStore.js";
import { addTeacherStore } from "../../store/teachersStore/AddTeacherStore";
import { addTestStore } from "../../store/TestStore/AddTestStore";
import { addResultStore } from "../../store/ResultStore/AddResultStore";
import feeAccount from "../../store/FeeAccountsStore/AddFeesStore.js";
import { withDrawExpense } from "../../store/ExpenseStore.js/WithDrawExpenseStore.js";
import { modelStore } from "../../store/ModelStore/ModelStore.js";

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

    addstudentStore.clearFormFields();
    addSubjectStore.clearFormFields();
    addTeacherStore.clearFormFields();
    addTestStore.clearFormFields();
    addResultStore.clearFormFields();
    feeAccount.clearFormFields();
    withDrawExpense.clearFormFields();

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
