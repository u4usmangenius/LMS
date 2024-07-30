// AddTestStore.js
import { makeObservable, observable, action } from "mobx";
class ModelStore {
  isModalOpen = false;
  isStd_ImgModalOpen = false;
  isModalOpen_anotherModel = false;
  isDuesModalOpen = false;

  constructor() {
    makeObservable(this, {
      isModalOpen: observable,
      isStd_ImgModalOpen: observable,
      isDuesModalOpen: observable,
      isModalOpen_anotherModel: observable,
      setisStd_ImgModalOpen: action.bound,
      setisModalOpen: action.bound,
      setisModalOpen_anotherModel: action.bound,
      setisDuesModalOpen: action.bound,
      openModel: action.bound,
      closeModel: action.bound,
      close_stdImageModal: action.bound,
      isDuesModelclose: action.bound,
      another_openModel: action.bound,
      another_closeModel: action.bound,
    });
  }

  setisModalOpen(bool) {
    this.isModalOpen = bool;
  }
  setisStd_ImgModalOpen(bool) {
    this.isStd_ImgModalOpen = bool;
  }
  setisModalOpen_anotherModel(bool) {
    this.isModalOpen_anotherModel = bool;
  }
  setisDuesModalOpen(bool) {
    this.isDuesModalOpen = bool;
    console.log("this.isDuesModalOpen=", this.isDuesModalOpen);
  }

  async openModel() {
    this.setisModalOpen(true);
  }

  async closeModel() {
    this.setisModalOpen(false);
  }
  async close_stdImageModal() {
    this.setisStd_ImgModalOpen(false);
  }
  async another_openModel() {
    this.setisModalOpen_anotherModel(true);
  }

  async another_closeModel() {
    this.setisModalOpen_anotherModel(false);
  }
  async isDuesModelclose() {
    this.setisDuesModalOpen(false);
  }
}

export const modelStore = new ModelStore();
