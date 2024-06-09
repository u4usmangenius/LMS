import React, { useEffect } from "react";
import "./Modal.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { addbookStore } from "../../store/BooksStore/AddBookStore.js";
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

    addbookStore.clearFormFields();
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
