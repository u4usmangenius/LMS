import React, { useEffect, useRef } from "react";
import { IoMdTrash } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import LoadingSpinner from "../../components/loaders/Spinner";
import { observer } from "mobx-react-lite";
import { studentStore } from "../../store/StudentsStore/StudentStore";
import "../styles/FormList.css";
import { addstudentStore } from "../../store/StudentsStore/AddStudentStore";
import NoData from "../../assests/noData.png";
import { modelStore } from "../../store/ModelStore/ModelStore";
import StudentSearchInput from "./StudentSearchInput";

const StudentList = () => {
  // below line for getting data by filter category
  const { FiltreClassName } = { ...studentStore };

  // useEffect(() => {
  //   studentStore.fetchDataFromBackend(1);
  // }, []);
  useEffect(() => {
    studentStore.fetchDataFromBackend(1);
  }, [addstudentStore.ApiFields]);

  //   }, [studentStore.FiltreCategoryName]);
  useEffect(() => {
    studentStore.getDataBYDepartments();
  }, []);
  const handleEdit = (student) => {
    addstudentStore.setstudentsData(student);
    console.log(student.studentId, "asd");
    modelStore.openModel();
  };
  const handleDelete = (student) => {
    studentStore.handleDelete(student);
  };
  const handlePageChange = (page) => {
    studentStore.setCurrentPage(page);
    studentStore.fetchDataFromBackend();
  };

  const handleSearchTextChange = (text) => {
    studentStore.setSearchText(text);
  };

  const handleFilterChange = (filter) => {
    studentStore.setSelectedFilter(filter);
  };
  return (
    <>
      <div className="Form-list-container">
        <div className="formlist--search-row">
          {/* show categories filter */}
          <container className="categories-filter-container">
            <div className="Form-search-bar">
              <select
                className="Form-filter-ClassName"
                value={addstudentStore.ApiFields.department_name}
                onChange={(e) => {
                  addstudentStore.setApiFields({
                    department_name: e.target.value,
                  });
                  //   if (
                  //     addstudentStore.ApiFields.department_name ===
                  //       "Select department" ||
                  //     addstudentStore.ApiFields.department_name?.trim() !== 0
                  //   ) {
                  //     addstudentStore.setApiFields({
                  //       batch_year: "Select Batch",
                  //       batch_time: "Select Session",
                  //     });

                  //     return;
                  //   }
                }}
              >
                <option value="">Select department</option>
                {studentStore.departments?.map((department, index) => (
                  <option key={index} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="Form-search-bar">
              <select
                className="Form-filter-ClassName"
                value={addstudentStore.ApiFields.batch_year}
                onChange={(e) => {
                  addstudentStore.setApiFields({
                    batch_year: e.target.value,
                  });

                  //   if (
                  //     !addstudentStore.ApiFields.department_name ||
                  //     addstudentStore.ApiFields.batch_year === "Select Batch"
                  //   ) {
                  //     addstudentStore.setApiFields({
                  //       batch_year: "Select Batch",
                  //       batch_time: "Select Session",
                  //     });

                  //     return;
                  //   } else if (
                  //     addstudentStore.ApiFields.department_name &&
                  //     addstudentStore.ApiFields.batch_year === ""
                  //   ) {
                  //     addstudentStore.setApiFields({
                  //       batch_time: "Select Session",
                  //     });
                  //   }
                }}
              >
                <option value="">Select Batch</option>
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
            <div className="Form-search-bar ">
              <select
                className="Form-filter-ClassName"
                value={addstudentStore.ApiFields.batch_time}
                onChange={(e) => {
                  //   if (addstudentStore.ApiFields.batch_year === "Select Batch") {
                  //     addstudentStore.setApiFields({
                  //       batch_time: "Select Session",
                  //     });

                  //     return;
                  //   }
                  addstudentStore.setApiFields({
                    batch_time: e.target.value,
                  });
                }}
              >
                <option>Select Session</option>
                <option>Morning</option>
                <option>Evening</option>
              </select>
            </div>
            <div className="Form-search-bar">
              <button
                className="FormList-pagination-button"
                style={{
                  width: "97px",
                  marginLeft:"-7px"
                }}
                onClick={() => {
                  addstudentStore.setApiFields({
                    batch_time: "Select Session",
                    batch_year: "Select Batch",
                    department_name: "Select department",
                  });
                  studentStore.fetchDataFromBackend(1);
                }}
              >
                clear filter
              </button>
            </div>
          </container>
          <StudentSearchInput />
        </div>

        {studentStore.isLoading ? (
          <LoadingSpinner />
        ) : !studentStore.students?.length ? (
          <div className="noData-container">
            <img src={NoData} alt="No Data to Show" className="noData-img" />
          </div>
        ) : (
          <div className="FormList-table">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Batch</th>
                  <th>Session</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentStore.students?.map((student) => (
                  <tr key={student.id}>
                    <td>{student.roll_no}</td>
                    <td>{student.name}</td>
                    <td>{student.phone_no ? student.phone_no : "-"}</td>
                    <td>{student.department_name}</td>
                    <td>{student.batch_year}</td>
                    <td>{student.batch_time}</td>
                    <td>{student.address}</td>
                    <td>{student.gender}</td>
                    <td className="FormList-edit-icon">
                      <div
                        onClick={() => handleEdit(student)}
                        className="FormList-edit-icons"
                      >
                        <BiEditAlt className="FormList-edit-icons" />
                      </div>
                      <IoMdTrash
                        onClick={() => handleDelete(student)}
                        className="FormList-delete-icon"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="FormList-pagination-header">
        <button
          onClick={() => handlePageChange(studentStore.currentPage - 1)}
          disabled={studentStore.currentPage === 1}
          className="FormList-pagination-button"
        >
          Prev
        </button>
        <div className="page-count">{studentStore.currentPage}</div>
        <button
          className="FormList-pagination-button"
          onClick={() => handlePageChange(studentStore.currentPage + 1)}
          disabled={
            studentStore.currentPage === studentStore.totalPages ||
            studentStore.students?.length === 0
          }
        >
          Next
        </button>
      </div>
    </>
  );
};

export default observer(StudentList);
