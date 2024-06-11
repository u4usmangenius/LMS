import React from "react";
import { modelStore } from "../../store/ModelStore/ModelStore";
import Modal from "../model/Modal";
import { observer } from "mobx-react-lite";
import HistorySearchInput from "./HistorySearchInput";
import HistoryList from "./HistoryList";
const History = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="formlist-list-container">
        <div className="formlist-header-row">
          <h1>History</h1>
          <HistorySearchInput />
        </div>
      </div>
      <HistoryList />
    </>
  );
};

export default observer(History);
