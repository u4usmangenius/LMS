// store.js
import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";

class SidebarStore {
  athover = false;
  feeORExpense = "";
  constructor() {
    makeObservable(this, {
      athover: observable,
      feeORExpense: observable,
      setatHover: action,
      setfeeORExpense: action,
    });
  }
  setatHover(value) {
    this.athover = value;
  }
  setfeeORExpense(value) {
    this.feeORExpense = value;
  }
}

export const sidebarStore = new SidebarStore();
