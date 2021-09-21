import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../context.js";
import Swal from "sweetalert2";
import { getToken } from '../firebase/firebase';

const Login = ({ setToken }) => {

  const [error, setError] = useState("");
  const history = useHistory();

  const { baseUrl, restaurant_status_table } = useGlobalContext();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      history.push("/Dashboard");
      window.location.reload(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    try {
      let user_data = { email: data.email, password: data.password , fcm: await getToken()};

      const result = await axios.post(
        baseUrl + "/superadmin/login",
        user_data
      );

      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        localStorage.setItem("user", JSON.stringify(user_Session_Data.data));
        const results = await axios(restaurant_status_table, {
          headers: { Authorization: user_Session_Data.data.token }
        });
        if (results.status === 200) {
          console.log(results.data.data[0]);
          localStorage.setItem('activechat', JSON.stringify(results.data.data[0]))
          localStorage.getItem("user");
          history.push("/Dashboard");
          window.location.reload(true);
        } else {
          Swal.fire({
            title: "ohh no!",
            text: 'something get wrong',
            icon: "warning",
            confirmButtonColor: 'rgb(234, 122, 154)'
          })
        }
      } else {
        setError(user_Session_Data.msg);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ width: "100vw", height: "100vh" }}
      >
        <div className="form_content"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px",
          }}>
          <form className="p-4 login_form" onSubmit={handleSubmit(onSubmit)}>
            <div className="container">
              <h2 className="text-center">
                <span>Scann</span>Menu
              </h2>
              <p className="text-center">Login in your account </p>
              <label for="uname">
                <b>Email</b>
              </label>
              <input
                type="text"
                className="p-2"
                placeholder="hello@example.com"
                name="email"
	        style={{textTransform: "lowercase"}}
                required
                {...register("email", { required: true, maxLength: 150 })}
              />

              <label for="password">
                <b>Password</b>
              </label>
              <input
                type="password"
                className="p-2"
                placeholder="Enter Password"
                name="password"
                required
                {...register("password", { required: true, maxLength: 150 })}
              />

              <Link to="/forgot">
                <a className="f-r" href="#">
                  Forgot password?
                </a>
              </Link>
              <p>{error}</p>
              <button type="submit" className="p-2">
                <b>
                  sign me in
                </b>
              </button>

              <div style={{ clear: "both" }}></div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
