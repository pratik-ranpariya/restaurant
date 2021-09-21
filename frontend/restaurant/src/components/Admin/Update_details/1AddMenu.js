import React, { useState } from "react";
import { useGlobalContext } from "../../../context.js";
import { useHistory } from "react-router-dom";
import uploadimg from "./Capture-removebg-preview.png";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const AddMenu = () => {
      const {
    addMenu,
    closeaddMenu,
    uploadmenu,
  } = useGlobalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

    const onSubmitmenu = async (data) => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);

      const formData = new FormData();
      formData.append("csv", data.csv[0]);

      const result = await axios(uploadmenu, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: formData,
      });
      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        alert(user_Session_Data.msg)
        closeaddMenu()
      } else {
        alert(user_Session_Data.msg)
      }
    } catch (error) {
      alert(error);
    }
  };

    return (
        <div className={`${addMenu ? "model-popup" : "none"}`}>
          <div className="model-wrap">
            <div className="model-body">
              <div className="model-content">
                <h4 className="text-center font-weight-bold mb-3">
                  Add Menu of the Restaurant
                </h4>
                <div className="upload_logo text-center">
                  <label for="RestaurantMenu">
                    <img
                      className="mb-2"
                      src={uploadimg}
                      alt=" ADD MENU"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </label>
                  <form
                    onSubmit={handleSubmit(onSubmitmenu)}
                    // encType="multipart/form-data"
                  >
                    <input
                      className="mb-2 float-right text-secondary btn chfile"
                      type="file"
                      id="RestaurantMenu"
                      name="csv"
                      // multiple
                      required
                      // style={{fontSize:"0.7rem"}}/
                      {...register("csv")}
                    />
                    <button
                      type="submit"
                      className="Csv_button py-2 px-5 border-light"
                    >
                      Upload CSV
                    </button>
                    <button
                      type="reset"
                      className="clos-btn"
                      onClick={closeaddMenu}
                    >
                      <FaTimes />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default AddMenu
