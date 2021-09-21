import React, { useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../context.js";

export default function OTP() {
  const { verifyotp } = useGlobalContext();

  const [error, setError] = useState("");
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getemail = localStorage.getItem("forgetemail");

  if (!getemail) {
    history.push("/");
  }

  const onSubmit = async (data) => {
    try {
      var email = JSON.parse(getemail);
      let user_data = { email: email, otp: data.otp }
      const result = await axios.post(verifyotp, user_data);
      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        history.push("/newpassword");
      } else {
        setError(user_Session_Data.msg);
      }
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className="form_content"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px",
        }}
      >
        <form class="p-4 login_form" onSubmit={handleSubmit(onSubmit)}>
          <div class="container">
            <h2 class="text-center">
              <span>Scann</span>Menu
            </h2>
            <label for="otp">
              <b>OTP</b>
            </label>
            <input
              type="text"
              class="p-2"
              placeholder="Enter Your OTP"
              required
              {...register("otp", { required: true, maxLength: 150 })}
            />
            <p>{error}</p>
            <button type="submit" class="p-2">
              <b>Submit</b>
            </button>
            <div style={{ clear: "both" }}></div>
          </div>
        </form>
      </div>
    </div>
  );
}
