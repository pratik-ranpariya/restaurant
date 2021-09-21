import React from "react";
import { useGlobalContext } from "../../../context.js";
import AddRestaurant from "./AddRestaurant.js";
import AddLogo from "./AddLogo.js";
import AddMenu from "./AddMenu.js";
import AddUPI from "./AddUPI.js";
import AddImage from "./AddImage.js";

const Update_details = () => {
  const {
    openaddRestaurant,
    openaddLogo,
    openaddMenu,
    openaddUPI,
    openaddimage,
    isSidebarOpen,
  } = useGlobalContext();

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2 p-5" : "my_container2 p-5"} `}
      >
        <div className="order_update p-4">
          <div className="d-flex justify-content-between flex-wrap mr-3">
            <div className="mr-5 pr-5 align-self-center">
              <h4 className="m-sm-0">
                <strong> Name of Restaurant</strong>
              </h4>
            </div>
            <div className="">
              <button className="Add_button" onClick={openaddRestaurant}>
                Add Name
              </button>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between flex-wrap mr-3">
            <div className="mr-5 align-self-center">
              <h4 className="m-sm-0">
                <strong> Logo of Restaurant</strong>
              </h4>
            </div>
            <div className="">
              <button className="Add_button" onClick={openaddLogo}>
                Add Logo
              </button>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between flex-wrap mr-3 ">
            <div className="mr-5 align-self-center">
              <h4 className="m-sm-0">
                <strong> Menu of Restaurant</strong>
              </h4>
            </div>
            <div className="">
              <button className="Add_button" onClick={openaddMenu}>
                Add Menu
              </button>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between flex-wrap mr-3">
            <div className="mr-5 align-self-center">
              <h4 className="m-sm-0">
                <strong> Restaurant UPI</strong>
              </h4>
            </div>
            <div className="">
              <button className="Add_button" onClick={openaddUPI}>
                Add UPI
              </button>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between flex-wrap mr-3">
            <div className="mr-5 align-self-center">
              <h4 className="m-sm-0">
                <strong> Add Image</strong>
              </h4>
            </div>
            <div className="">
              <button className="Add_button" onClick={openaddimage}>
              Add Image
              </button>
            </div>
          </div>
          <hr />
        </div>
        <AddRestaurant/>
        <AddLogo/>
        <AddMenu/>
        <AddUPI/>
        <AddImage/>
      </div>
    </>
  );
};

export default Update_details;
