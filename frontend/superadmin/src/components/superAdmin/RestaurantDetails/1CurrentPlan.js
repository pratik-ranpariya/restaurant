import React, { useState, useMemo, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGlobalContext } from "../../../context";
import "../table.css";
import Swal from "sweetalert2";
import { parseInt } from "lodash";

const AutoReneue = (id) => {
  const { isSidebarOpen, getRestoSubcription, editSubcriptionDetails, size } =
    useGlobalContext();

  const [restaurant_type, setrestaurant_type] = useState("");
  const [dining_table, setdining_table] = useState(0);
  const [rooms, setrooms] = useState(0);

  const getToken = localStorage.getItem("user");
  var myToken = JSON.parse(getToken);

  const callApis = async () => {
    try {
      const result = await axios.get(getRestoSubcription + "?_id=" + id.id, {
        headers: { Authorization: myToken.token },
      });

      if (result.status === 200) {
        setrestaurant_type(result.data.data.restaurant_type.restaurant_type);
        setdining_table(result.data.data.restaurant_type.dining_table.length);
        setrooms(result.data.data.restaurant_type.rooms.length);
      }
    } catch (e) {
      Swal.fire({
        title: "Ohh no!",
        text: e.message,
        icon: "error",
        confirmButtonColor: "rgb(234, 122, 154)",
      });
    }
  };

  useEffect(() => {
    callApis();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, e) => {
    try {
      // console.log(e.target);
      if (restaurant_type === "hotel") {
        data.dining = parseInt(dining_table);
        data.room = parseInt(rooms);
        data.plans = "hotel";
        data._id = id.id;
      } else if (restaurant_type === "dining_table") {
        data.dining = parseInt(dining_table);
        data.plans = "dining_table";
        data._id = id.id;
      }

      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);

      const result = await axios(editSubcriptionDetails, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: data,
      });

      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        Swal.fire({
          title: "Done!",
          text: user_Session_Data.msg,
          icon: "success",
          confirmButtonColor: "rgb(234, 122, 154)",
        });
        window.location.reload(true);
      } else {
        Swal.fire({
          title: "ohh no!",
          text: user_Session_Data.msg,
          icon: "warning",
          confirmButtonColor: "rgb(234, 122, 154)",
        });
      }
    } catch (e) {
      Swal.fire({
        title: "Oops!",
        text: e.message,
        icon: "error",
        confirmButtonColor: "rgb(234, 122, 154)",
      });
    }
  };

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2" : ""} `}
        style={isSidebarOpen ? {minHeight: '0px'} : {}}
      >
        <div
          className={`${
            isSidebarOpen ? (size <= 1100 ? "overflow-auto " : "") : ""
          }`}
        >
          <h3 className="text-center mb-5 mt-3"> <b>change Subscription Details</b></h3>

          {/* {restoPlan.restaurant_type} */}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row justify-content-center">
              {restaurant_type !== "take_away" ? (
                <div className="form-group col-lg-4 col-md-3 col-sm-4">
                  <label htmlfor="plansize">Dining</label>
                  <input
                    className="form-control"
                    id="exampleInputName"
                    name="dining"
                    style={{ backgroundColor: "ghostwhite", outline: "none" }}
                    type="number"
                    name="dining"
                    value={dining_table}
                    onChange={(e) => setdining_table(e.target.value)}
                    //   {...register("dining", { required: true })}
                  />
                </div>
              ) : (
                ""
              )}

              {restaurant_type === "hotel" ? (
                <div className="form-group col-lg-4 col-md-3 col-sm-4">
                  <label htmlfor="plansize">Hotel</label>
                  <input
                    className="form-control"
                    id="exampleInputName"
                    name="hotel"
                    style={{ backgroundColor: "ghostwhite", outline: "none" }}
                    type="number"
                    name="hotel"
                    value={rooms}
                    onChange={(e) => setrooms(e.target.value)}
                    //   onChange={(e) => changePlane(e)}
                    //   {...register("hotel", { required: true })}
                  />
                </div>
              ) : (
                ""
              )}
           
            <div className="form-group mb-5 mt-2 col-lg-2 col-md-3 col-sm-4">
              <button
                type="submit"
                className="btn btn-grad"
                style={{ marginTop:"14px"}}
              >
                <h3 className="m-0">
                  <small>Update</small>
                </h3>
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AutoReneue;
