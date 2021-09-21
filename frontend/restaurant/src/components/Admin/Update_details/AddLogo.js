import React, { useState } from "react";
import { useGlobalContext } from "../../../context.js";
import { Link, useHistory } from "react-router-dom";
import uploadimg from "./Capture-removebg-preview.png";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const AddLogo = () => {
  const {
 uploadnamelogo,
    addLogo,
    closeaddLogo,
  } = useGlobalContext();

  const history = useHistory();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitlogo = async (data) => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);

      const formData = new FormData();
      formData.append("restaurent_logo", data.restaurent_logo[0]);

      const result = await axios(uploadnamelogo, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: formData,
      });
      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        Swal.fire({
          title: "Done",
          text: user_Session_Data.msg,
          icon: "success",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
        closeaddLogo()
      } else {
        Swal.fire({
          title: "ohh no!",
          text: user_Session_Data.msg,
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      
      }
    } catch (e) {
      Swal.fire({
        title: "ohh no!",
        text: e.msg,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };
  return (
    <div className={`${addLogo ? "model-popup" : "none"}`}>
      <div className="model-wrap">
        <div className="model-body">
          <div className="model-content">
            <div className="container">
              <h4 className="text-center font-weight-bold mb-3">
                Add LOGO of the Restaurant
              </h4>
              <div className="upload_logo text-center">
                <label for="RestaurantLogo">
                  <img
                    className="mb-2"
                    src={uploadimg}
                    alt=" ADD Logo"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </label>
                <form action="" onSubmit={handleSubmit(onSubmitlogo)}>
                  <input
                    className="mb-2 float-right text-secondary btn chfile"
                    type="file"
                    id="RestaurantLogo"
                    name="restaurent_logo"
                    required
                    {...register("restaurent_logo")}
                  />
                  <button
                    type="submit"
                    className="Csv_button py-2 px-5 border-light"
                    style={{borderRadius:"10px"}}
                  >
                    Upload Logo
                  </button>
                  <button
                    type="reset"
                    className="clos-btn"
                    onClick={closeaddLogo}
                  >
                    <FaTimes />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLogo;
