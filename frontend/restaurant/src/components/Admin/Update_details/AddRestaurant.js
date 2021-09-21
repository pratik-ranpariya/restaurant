import React from "react";
import { useGlobalContext } from "../../../context.js";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const AddRestaurant = () => {
  const { uploadnamelogo, addRestaurant, closeaddRestaurant, size } =
    useGlobalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);

      const formData = new FormData();
      formData.append("name", data.name);

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
        closeaddRestaurant()
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
    <div className={`${addRestaurant ? "model-popup" : "none"}`}>
      <div className="model-wrap">
        <div className="model-body">
          <div className="model-content">
            <div className="input_popup">
              <h5 className="text-center mb-5">Add Name of the Restaurant</h5>
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="row d-flex justify-content-center">
                  {/* <div className="col-12 col-lg-8 col-md-8 col-sm-8 align-self-center"> */}
                  <input
                    type="text"
                    className="update_input col-12 col-lg-8 col-md-8 col-sm-8 align-self-center"
                    placeholder="Restaurant"
                    name="name"
                    style={{ maxWidth: "80%" }}
                    required
                    {...register("name")}
                  />
                  {/* </div> */}
                  {/* <div className="col-6 col-lg-4 col-md-4  col-sm-4"> */}
                  <button
                    className={`${
                      size <= 580
                        ? "col-6 col-lg-4 col-md-4  col-sm-4 Update_button border-transperant py-2 mt-2"
                        : "col-5 col-lg-4 col-md-4  col-sm-4 Update_button border-transperant py-2"
                    }`}
                    // className=""
                    type="submit"
                    style={{borderRadius:"10px"}}
                    // className="Update_button border-transperant py-2"
                  >
                    Update
                  </button>
                  {/* </div> */}
                </div>
              </form>
              <button className="clos-btn" onClick={closeaddRestaurant}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;
