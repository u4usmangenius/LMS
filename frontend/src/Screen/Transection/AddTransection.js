import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { observer } from "mobx-react"; // Import MobX observer
import { addtransectionStore } from "../../store/TransectionStore/AddTransectionStore";
import { validations } from "../../helper.js/TransectionValidationStore";
import { transectionStore } from "../../store/TransectionStore/TransectionStore";
import InputMask from "react-input-mask";
import { modelStore } from "../../store/ModelStore/ModelStore";
import LoadingSpinner from "../../components/loaders/Spinner";

const Addtransections = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [categorized_books, setCategorized_books] = useState([]);

  useEffect(() => {
    if (
      addtransectionStore.formData.name ||
      addtransectionStore.formData.title
      //   ||
      //   addtransectionStore.formData.phone_no ||
      //   addtransectionStore.formData.due_date ||
      //   //   (
      //   addtransectionStore.formData.batch_year ||
      //   // &&
      //   // addtransectionStore.formData.batch_year !== "Select Batch")
      //   (
      //     addtransectionStore.formData.batch_time &&
      //     addtransectionStore.formData.batch_time !== "Select Session"
      //   )(
      //     addtransectionStore.formData.department_name &&
      //       addtransectionStore.formData.department_name !== "Select Department"
      //   ) ||
      //   (addtransectionStore.formData.category &&
      //     addtransectionStore.formData.category !== "Select Category")
    ) {
      addtransectionStore.editORsubmit = true;
      addtransectionStore.RestrictAddAnother = true;
    } else {
      addtransectionStore.editORsubmit = false;
      addtransectionStore.RestrictAddAnother = false;
    }
    // addtransectionStore.fetchData();
  }, []);
  useEffect(() => {
    transectionStore.getDataBYCategory();
    transectionStore.getDepartments();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (
        addtransectionStore.formData.department_name &&
        addtransectionStore.formData.department_name !== "Select Department" &&
        addtransectionStore.formData.batch_year &&
        addtransectionStore.formData.batch_year !== "Select Batch" &&
        addtransectionStore.formData.batch_time &&
        addtransectionStore.formData.batch_time !== "Select Session"
      ) {
        setLoading(true);
        setStudents([]);
        let students = await transectionStore.fetchStudents();
        setStudents(students);
        console.log("usman mily kya students", students);
        setLoading(false);
        console.log("returning now");
        return students;
      }
    };

    let students = fetchData();
  }, [
    addtransectionStore.formData.department_name,
    addtransectionStore.formData.batch_year,
    addtransectionStore.formData.batch_time,
  ]);
  useEffect(() => {
    const fetchData = async () => {
      if (
        addtransectionStore.formData.category &&
        addtransectionStore.formData.category !== "Select Category"
      ) {
        setLoading(true);
        setCategorized_books([]);
        let categorized_book = await transectionStore.fetchCategorizedBooks();
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyy", categorized_book);
        setCategorized_books(categorized_book);
        console.log("usman mily kya students", categorized_book);
        setLoading(false);
        console.log("returning now");
        return categorized_book;
      }
    };

    let students = fetchData();
  }, [addtransectionStore.formData.department_name,addtransectionStore.formData.category]);
  const handleAddAnotherClick = () => {
    if (addtransectionStore.RestrictAddAnother) {
      return;
    }
    validations.errors.roll_no = false;
    validations.errors.name = false;
    validations.errors.batch_year = false;
    validations.errors.batch_time = false;
    validations.errors.department_name = false;
    validations.errors.category = false;
    validations.errors.phone_no = false;
    validations.errors.title = false;
    validations.errors.due_date = false;
    addtransectionStore.clearFormFields();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !addtransectionStore.formData?.roll_no ||
      !addtransectionStore.formData.name?.trim() ||
      !addtransectionStore.formData.batch_year?.trim() ||
      !addtransectionStore.formData.batch_time?.trim() ||
      !addtransectionStore.formData.department_name?.trim() ||
      !addtransectionStore.formData.category?.trim() ||
      !addtransectionStore.formData.title
    ) {
      validations.errors.roll_no = true;
      validations.errors.name = true;
      validations.errors.batch_year = true;
      validations.errors.batch_time = true;
      validations.errors.department_name = true;
      validations.errors.category = true;
      validations.errors.title = true;
      return;
    }
    if (addtransectionStore.formData.category === "Select Category") {
      validations.errors.category = true;
      return;
    } else {
      if (addtransectionStore.editORsubmit) {
        transectionStore.handleSaveEdit();
      } else {
        addtransectionStore.handleSubmit();
      }
      modelStore.closeModel();
    }
  };

  return (
    <div className="add-form-content">
      <h2 className="add-form-heading">Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                (validations.errors.department_name &&
                  addtransectionStore.formData.department_name?.trim() ===
                    "Select Department") ||
                addtransectionStore.formData.department_name?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Department Name
              {validations.errors.department_name &&
                (addtransectionStore.formData.department_name?.trim() ===
                  "Select Department" ||
                  addtransectionStore.formData.department_name?.trim() ===
                    "") && <span className="steric-error-msg"> *</span>}
            </label>
            <select
              value={addtransectionStore.formData.department_name}
              className="addForm-input-select"
              onChange={(e) =>
                addtransectionStore.setFormData({
                  department_name: e.target.value,
                })
              }
            >
              <option>Select Department</option>
              {transectionStore.departments?.map((categories, index) => (
                <option key={index} value={categories.name}>
                  {categories.name}
                </option>
              ))}
            </select>
          </div>
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                (validations.errors.batch_year &&
                  addtransectionStore.formData.batch_year?.trim() ===
                    "Select Batch") ||
                addtransectionStore.formData.batch_year?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Batch
              {validations.errors.batch_year &&
                (addtransectionStore.formData.batch_year?.trim() ===
                  "Select Batch" ||
                  addtransectionStore.formData.batch_year?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addtransectionStore.formData.batch_year}
              className="addForm-input-select"
              onChange={(e) =>
                addtransectionStore.setFormData({ batch_year: e.target.value })
              }
              disabled={
                !addtransectionStore.formData.department_name ||
                addtransectionStore.formData.department_name ===
                  "Select Department"
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
                (validations.errors.batch_time &&
                  addtransectionStore.formData.batch_time?.trim() ===
                    "Select Session") ||
                addtransectionStore.formData.batch_time?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Session
              {validations.errors.batch_time &&
                (addtransectionStore.formData.batch_time?.trim() ===
                  "Select Session" ||
                  addtransectionStore.formData.batch_time?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addtransectionStore.formData.batch_time}
              className="addForm-input-select"
              onChange={(e) =>
                addtransectionStore.setFormData({ batch_time: e.target.value })
              }
              disabled={
                !addtransectionStore.formData.department_name ||
                !addtransectionStore.formData.batch_year ||
                addtransectionStore.formData.department_name ===
                  "Select Department" ||
                addtransectionStore.formData.batch_year === "Select Batch"
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
                (validations.errors.roll_no &&
                  addtransectionStore.formData.roll_no === "Select RollNo") ||
                addtransectionStore.formData.roll_no === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Roll No
              {validations.errors.roll_no &&
                (addtransectionStore.formData.roll_no === "Select RollNo" ||
                  addtransectionStore.formData.roll_no === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>

            {/* <option>Select Roll No</option> */}
            <select
              value={addtransectionStore.formData.roll_no}
              className="addForm-input-select"
              onChange={(e) => {
                const selectedRollNo = e.target.value;
                const selectedStudent = students.find((student) => {
                  return parseInt(student.roll_no) === parseInt(selectedRollNo);
                });
                console.log("is this selected student is", selectedStudent);
                if (selectedStudent) {
                  addtransectionStore.setFormData({
                    roll_no: e.target.value,
                    name: selectedStudent ? selectedStudent?.name : "",
                    phone_no: selectedStudent ? selectedStudent?.phone_no : "",
                  });
                  console.log(
                    "selectedStudent.phone_no",
                    selectedStudent.phone_no
                  );
                } else {
                  addtransectionStore.setFormData({
                    roll_no: e.target.value,
                    name: "",
                    phone_no: "",
                  });
                }
              }}
            >
              <option value={""}>Select RollNo</option>
              {loading ? null : (
                <>
                  {students && students.length > 0
                    ? students.map((student) => (
                        <option key={student.id} value={student.roll_no}>
                          {student.roll_no}
                        </option>
                      ))
                    : null}
                </>
              )}
            </select>
          </div>
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.name &&
                addtransectionStore.formData.name?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Name
              {validations.errors.name &&
                addtransectionStore.formData.name?.trim() === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <input
              type="text"
              className="addForm-input-type-text"
              value={
                addtransectionStore.formData.roll_no
                  ? addtransectionStore.formData.name
                    ? addtransectionStore.formData.name
                    : "No name"
                  : "Empty"
              }
              disabled={
                addtransectionStore.formData?.department_name ||
                addtransectionStore.formData?.name ||
                addtransectionStore.formData?.roll_no
              }
              style={{
                cursor: "default",
              }}
            />

            {/* <select
                value={addtransectionStore.formData.name}
                className="addForm-input-select"
                disabled={
                    addtransectionStore.formData.roll_no ||
                    addtransectionStore.formData.roll_no === ""
                }
                >
                <option value={""}>Select Name</option>
                <option>{addtransectionStore.formData.name}</option>
                </select>{" "} */}
          </div>

          <div className="add-form-group">
            <label className={`addForm-input-label`}>Phone</label>
            <input
              type="text"
              className="addForm-input-type-text"
              value={
                addtransectionStore.formData?.roll_no
                  ? addtransectionStore.formData?.phone_no
                    ? addtransectionStore.formData?.phone_no
                    : "No Phone Number"
                  : "Empty"
              }
              disabled={
                addtransectionStore.formData.department_name ||
                addtransectionStore.formData.roll_no ||
                addtransectionStore.formData.phone_no
              }
              style={{
                cursor: "default",
              }}
            />
          </div>
        </div>
        <div className="add-form-row">
          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                (validations.errors.category &&
                  addtransectionStore.formData.category?.trim() ===
                    "Select Category") ||
                addtransectionStore.formData.category?.trim() === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Category
              {validations.errors.category &&
                (addtransectionStore.formData.category?.trim() ===
                  "Select Category" ||
                  addtransectionStore.formData.category?.trim() === "") && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addtransectionStore.formData.category}
              className="addForm-input-select"
              onChange={(e) =>
                addtransectionStore.setFormData({
                  category: e.target.value,
                })
              }
            >
              <option>Select Category</option>
              {transectionStore.categories?.map((categories, index) => (
                <option key={index} value={categories.name}>
                  {categories.name}
                </option>
              ))}
            </select>
          </div>

          <div className="add-form-group">
            <label
              className={`addForm-input-label ${
                validations.errors.title &&
                addtransectionStore.formData.title === ""
                  ? "steric-error-msg"
                  : "normal-label"
              }`}
            >
              Title
              {validations.errors.title &&
                addtransectionStore.formData.title === "" && (
                  <span className="steric-error-msg"> *</span>
                )}
            </label>
            <select
              value={addtransectionStore.formData.title}
              className="addForm-input-select"
              onChange={(e) => {
                // Find the selected book object based on its title
                const selectedBook = categorized_books.find(
                  (book) => book.title === e.target.value
                );

                if (selectedBook) {
                  addtransectionStore.setFormData({
                    title: e.target.value,
                    book_id: selectedBook.id,
                    book_quantity: selectedBook.quantity,
                  });
                } else {
                  addtransectionStore.setFormData({
                    title: "",
                    book_id: "",
                    book_quantity: "",
                  });
                }
              }}
              // onChange={(e) => {
              //   addtransectionStore.setFormData({
              //     title: e.target.value,
              //     book_id: `here i want to show selected book id ${e.id}`,
              //     book_quantity: `here i want to show selected book id ${e.id}`,
              //   });
              // }}
            >
              <option value={""}>Select Book</option>
              {loading ? null : (
                <>
                  {categorized_books && categorized_books.length > 0
                    ? categorized_books.map((book) => (
                        <option key={book.id} value={book.title}>
                          {book.title}
                        </option>
                      ))
                    : null}
                </>
              )}
            </select>
          </div>
        </div>

        <div className="addForm-another-btn">
          <div
            className="add-another-form-text"
            onClick={handleAddAnotherClick}
            disabled={addtransectionStore.RestrictAddAnother === true}
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
            {addtransectionStore.RestrictAddAnother === true
              ? "Update Now"
              : "Add Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default observer(Addtransections);
