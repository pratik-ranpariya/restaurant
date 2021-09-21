import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../context.js";

export default function Newpassword() {
  const { newpassword } = useGlobalContext();

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
      if (data.password === data.confirm) {
        let strongPassword = new RegExp(
          "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
        );
        if (strongPassword.test(data.password)) {
	let user_data = { email: email, password: data.password };
        const result = await axios.post(newpassword, user_data);
        let user_Session_Data = result.data;
        if (user_Session_Data.status === 200) {
          localStorage.clear();
          history.push("/");
        } else {
          setError(user_Session_Data.msg);
        }
        } else {
          setError("Password must be minimum 8 character, one special character, capital and number");
        }
      } else {
	 setError("Password Not Match");
      }
    } catch (e) {
      setError(e.essage);
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
            <label for="otp">
              <b>password</b>
            </label>
            <input
              type="text"
              class="p-2"
              placeholder="Enter Your Password"
              required
              {...register("password", { required: true, maxLength: 150 })}
            />
            <label for="otp">
              <b>Confirm password</b>
            </label>
            <input
              type="text"
              class="p-2"
              placeholder="Conform Password"
              required
              {...register("confirm", { required: true, maxLength: 150 })}
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
