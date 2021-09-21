import React, { useState, useEffect } from "react";
import { useHistory,Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../context.js";
//import firebase from '../firebase/firebase'
import Swal from "sweetalert2";
import { getToken } from '../firebase/firebase';

const Login = ({ setToken }) => {
  const [error, setError] = useState("");
  const history = useHistory();

  const { baseUrl } = useGlobalContext();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      history.push("/Dashboard");
      // window.location.reload(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // const msg=firebase.messaging();
      //   const fcm = await msg.requestPermission()
      //   console.log(await msg.getToken());

  /*    var msg = null, fcm, token = '';
  if (firebase.messaging.isSupported()) {
    msg = firebase.messaging();
    fcm = await msg.requestPermission()
     token = await msg.getToken()
  }*/



      let user_data = { username: data.username, password: data.password, fcm: await getToken()};

      // let user_data = { username: data.username, password: data.password, fcm: await msg.getToken() };

      const result = await axios.post(  
        baseUrl + "/restaurants/login",
        user_data
      );

      let user_Session_Data = result.data;
  
      if (user_Session_Data.status === 200) {
        localStorage.setItem("user", JSON.stringify(user_Session_Data.data));
        localStorage.getItem("user");
        history.push("/Dashboard");
        window.location.reload(true);
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
        <div
          className="form_content"
          style={{
            // boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px",
          }}
        >
          <form className="p-4 login_form" onSubmit={handleSubmit(onSubmit)}>
            <div className="container">
              <h2 className="text-center">
                <span>Scann</span>Menu
              </h2>
              <p className="text-center">Login in your account </p>
              <label for="uname">
                <b>User Name</b>
              </label>
              <input
                type="text"
                className="p-2"
                placeholder="Enter User Name"
                name="username"
	        style={{textTransform: "lowercase"}}
                required
                {...register("username", { required: true, maxLength: 150 })}
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

              {/* <label>
                <input type="checkbox" name="remember" /> Remember my preferance
              </label> */}
              <Link to="/forgot">
              <a className="f-r" href={{}}>
                Forgot password?
              </a>
              </Link>
              <p className="m-2">{error}</p>
              <button type="submit" className="p-2">
                <b>sign me in</b>
              </button>

              <div style={{ clear: "both" }}></div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired,
// };

export default Login;
