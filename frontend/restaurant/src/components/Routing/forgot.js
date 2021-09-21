import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../context.js";
import Swal from "sweetalert2";

export default function Forgot() {
  const { forgotpass } = useGlobalContext();

  const [error, setError] = useState("");
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let user_data = { email: data.email };

      const result = await axios.post(forgotpass, user_data);

      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        localStorage.setItem("forgetemail", JSON.stringify(data.email));
        history.push("/OTP");
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
            <p class="text-center">Forget Password</p>
            <label for="uname">
              <b>Email</b>
            </label>
            <input
              type="email"
              class="p-2"
              placeholder="hello@example.com"
              name="email"
              required
              {...register("email", { required: true, maxLength: 150 })}
            />

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
