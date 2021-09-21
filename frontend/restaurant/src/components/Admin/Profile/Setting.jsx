import React from "react";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../../context.js";
import axios from "axios";
import Swal from 'sweetalert2'

const Setting = () => {
  const { uploadnamelogo, baseUrl, data } = useGlobalContext();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({ shouldFocusError: true });

  const onSubmit = async (data, e) => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      if (data.restaurent_cover.length > 0) {
        const coverdata = new FormData();
        coverdata.append("restaurent_cover", data.restaurent_cover[0]);

        const result = await axios(baseUrl + "/restaurants/editcoverimage", {
          headers: { Authorization: myToken.token },
          method: "POST",
          data: coverdata,
        });
      }
      delete data.restaurent_cover;

      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
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
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        Swal.fire({
          title: "ohh no!",
          text: user_Session_Data.data,
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } catch (e) {
      Swal.fire({
        title: "ohh no!",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };

  return (
    <>
      <div className="row mb-3 mt-4">
        <h4
          className="col-sm font-weight-bolder m-0"
          style={{ color: "#ea7a9a" }}
        >
          Account Setting
        </h4>
      </div>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-sm">
              <label htmlFor="name" style={{ fontWeight: "600" }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
	        defaultValue={data.name}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  border: "1px solid rgb(232, 232, 232)",
                  padding: "6px",
                  outline: "none",
                }}
                {...register("name")}
              />
            </div>
	   {/* <div className="col-sm">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                style={{
                  width: "100%",
                  borderRadius: "25px",
                  border: "1px solid rgb(232, 232, 232)",
                  padding: "6px",
                  outline: "none",
                }}
                {...register("email")}
              />
            </div> */}
	  </div> 
          <div className="row mt-4 m-0">
            <label htmlFor="mobile">
              <strong>Phone Number</strong>
            </label>
            <input
              type="number"
              name="mobile"
              min="0"
              // maxl="1"
              // max="9999999999"
              // pattern=".{5,10}"
              // pattern="[0-1]"
	      defaultValue={data.mobile}
              placeholder="123456789"
              style={{
                width: "100%",
                borderRadius: "10px",
                border: "1px solid rgb(232, 232, 232)",
                padding: "6px",
                outline: "none",
                WebkiAappearance: "none",
              }}
              {...register(
                "mobile"
                // { required: "Please enter your first name." }
                // {
                //   maxLength: {
                //     value: 10,
                //     message: "ghjihiko",
                //     valueAsNumber: true,
                //   },
                //   minLength: {
                //     value: 10,
                //     message: "error message",
                //   },
                // }
              )}
            />
          </div>
          <div className="row mt-4 m-0">
            <label htmlFor="address">
              <strong>Address</strong>
            </label>
            <input
              className="text-secondary"
              type="text"
              name="adress"
	  defaultValue={data.address}
              placeholder="Flat no., floor, Street"
              style={{
                width: "100%",
                borderRadius: "10px",
                border: "1px solid rgb(232, 232, 232)",
                padding: "6px",
                outline: "none",
              }}
              {...register("address")}
            />
          </div>
          <div className="row mt-4 m-0">
            <label htmlFor="about">
              <strong>About</strong>
            </label>
            <textarea
              className="text-secondary"
              // type="textarea"
              name="about"
              placeholder="About Restaurant"
              style={{
                width: "100%",
                borderRadius: "10px",
                border: "1px solid rgb(232, 232, 232)",
                padding: "6px",
                outline: "none",
              }}
	      defaultValue={data.about}
              {...register("about")}
            />
          </div>
          <div className="row mt-4">
            <div className="col-sm">
              <label htmlFor="city">
                <strong>City</strong>
              </label>
              <input
                type="text"
                name="city"
                placeholder="City"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  border: "1px solid rgb(232, 232, 232)",
                  padding: "6px",
                  outline: "none",
                }}
	        defaultValue={data.city}
                {...register("city")}
              />
            </div>
            <div className="col-sm">
              <label htmlFor="state">
                <strong>State</strong>
              </label>
              <select
                name="cars"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  border: "1px solid rgb(232, 232, 232)",
                  padding: "6px",
                  outline: "none",
                }}
	        defaultValue={data.state}
                {...register("state")}
              >
                <option value="" selected disabled hidden>
                  Choose...
                </option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Andaman and Nicobar Islands">
                  Andaman and Nicobar Islands
                </option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Dadar and Nagar Haveli">
                  Dadar and Nagar Haveli
                </option>
                <option value="Daman and Diu">Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
            <div className="col-sm">
              <label htmlFor="zip">
                <strong>Zip</strong>
              </label>
              <input
                type="text"
                name="zip"
	        defaultValue={data.zip}
                // placeholder="Email"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  border: "1px solid rgb(232, 232, 232)",
                  padding: "6px",
                  outline: "none",
                }}
                {...register("zip")}
              />
            </div>
          </div>
          <div className="row mt-4 m-0">
            <label htmlFor="restaurent_cover">
              <strong>Cover Photo</strong>
            </label>
            <input
              className="text-secondary btn"
              type="file"
              name="restaurent_cover"
              style={{
                width: "100%",
                // borderRadius: "25px",
                // border: "1px solid rgb(232, 232, 232)",
                padding: "6px",
                outline: "none",
              }}
              {...register("restaurent_cover")}
            />
          </div>
          <div className="row mt-5 m-0">
            <button
              type="submit"
              style={{
                color: "white",
                backgroundColor: "#ea7a9a",
                borderRadius: "10px",
                outline: "none !important",
                boxShadow: "none",
                cursor: "pointer",
                padding: "12px",
                border: "none",
              }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Setting;
