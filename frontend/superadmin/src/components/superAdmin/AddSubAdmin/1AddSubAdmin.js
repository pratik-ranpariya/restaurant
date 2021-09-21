import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AppContext, useGlobalContext } from "../../../context.js";
import { useForm } from "react-hook-form";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
// import { useAuthState } from './hooks';

 firebase.initializeApp({
  apiKey: "AIzaSyB9ir88TBdApxuWJJJp7TWCAVs2VVS6LYM",
  authDomain: "scannmenu-a263c.firebaseapp.com",
  projectId: "scannmenu-a263c",
  storageBucket: "scannmenu-a263c.appspot.com",
  messagingSenderId: "205176802477",
  appId: "1:205176802477:web:2f5dfd006819d0fad20a24",
  databaseURL: "https://scannmenu-a263c-default-rtdb.firebaseio.com"
})

const AddSubAdmin = () => {
  
  // const [lastrestaurant, setlastrestaurant] = useState('')
  // const { user } = useAuthState(firebase.auth())

  // console.log(user);
  
  // console.log(user);
  const [dining, setdining] = useState(false);
  const [hotel, sethotel] = useState(false);
  
  const [error, setError] = useState("");
  
  const history = useHistory();
  
  const { isSidebarOpen, Add_SubAdmin, in_firebase_id} = useGlobalContext();
  
  const adddining = () => {
    sethotel(false);
    setdining(true);
  };
  const addhotel = () => {
    sethotel(true);
    setdining(false);
  };
  const addtakeaway = () => {
    sethotel(false);
    setdining(false);
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  
  const onSubmit = async (data) => {
   // alert(JSON.stringify(data));
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      
      const result = await axios(Add_SubAdmin, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: data,
      });
      
      let user_Session_Data = result.data;
     // console.log(user_Session_Data);
      if (user_Session_Data.status === 200) {

        // firebase id create ----
        const iii = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
        if(iii.user.uid){
          const Updatefuid = await axios(in_firebase_id, {
            headers: { Authorization: myToken.token },
            method: "POST",
            data: {email: data.email, fuid: iii.user.uid},
          });
          if(Updatefuid.data.status === 200){
            alert(Updatefuid.data.msg)
            window.location.reload(true);
          } else {
            setError(Updatefuid.data.msg);
          }
        }
        // firebase id created ----

      } else {
        setError(user_Session_Data.msg);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}>
      <div className="" style={{ padding: "3%", maxWidth: "50rem" }}>
        <div
          className="con1"
          style={{ boxSizing: "border-box", padding: "0%", margin: "0%" }}
        >
          <div style={{ padding: "40px" }}>
            <h2 className="m-0">
              <small>Sign Up</small>
            </h2>
            <div className="mb-4" style={{ position: "relative" }}>
              <hr
                width="100%"
                color="ghostwhite"
                style={{ position: "absolute", border: "none", height: "3px" }}
              />
              <hr
                width="10%"
                color="#ea7a9a"
                style={{ position: "absolute", border: "none", height: "3px" }}
              />
            </div>
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlfor="exampleInputEmail1">Resturent Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputName"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="name"
                  required
                  {...register("name", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group">
                <label htmlfor="exampleInputEmail1">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="email"
                  required
                  {...register("email", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group">
                <label htmlfor="exampleInputEmail1">User Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputUserName"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="username"
                  required
                  {...register("username", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group">
                <label htmlfor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="password"
                  minLength="6"
                  required
                  {...register("password", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group">
                <label htmlfor="exampleInputPassword1">Mobile</label>
                <input
                  type="mobile"
                  className="form-control"
                  id="exampleInputPassword1"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="mobile"
                  required
                  {...register("mobile", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group">
                <label htmlfor="exampleInputEmail1">Address</label>
                <textarea
                  type="text-area"
                  className="form-control"
                  id="exampleInputAddress"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="address"
                  required
                  {...register("address", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group">
                <label htmlfor="exampleInputEmail1">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputCity"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="city"
                  required
                  {...register("city", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group">
                <label htmlfor="exampleInputEmail1">State</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputState"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="state"
                  required
                  {...register("state", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group">
                <label htmlfor="exampleInputEmail1">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputCountry"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="country"
                  required
                  {...register("country", { required: true, maxLength: 150 })}
                />
              </div>
              <div className="form-group d-flex justify-content-around">
                <div className="form-group">
                  <input
                    type="radio"
                    name="plans"
                    id="takeaway"
                    value="take_away"
                    onClick={addtakeaway}
                    {...register("plans", { required: true, maxLength: 150 })}
                  />
                  <label htmlFor="takeaway" className="ml-1">
                    Take Away
                  </label>
                </div>
                <div className="form-group">
                  <input
                    type="radio"
                    name="plans"
                    id="dining"
                    value="dining_table"
                    onClick={adddining}
                    required
                    {...register("plans", { required: true, maxLength: 150 })}
                  />

                  <label htmlFor="dining" className="ml-1">
                    Dining
                  </label>
                </div>
                <div className="form-group">
                  <input
                    type="radio"
                    name="plans"
                    id="hotel"
                    value="hotel"
                    onClick={addhotel}
                    required
                    {...register("plans", { required: true, maxLength: 150 })}
                  />
                  <label htmlFor="hotel" className="ml-1">
                    Hotel
                  </label>
                </div>
              </div>
              {dining && (
                <div>
                  <label htmlFor="">
                    <small>Add Number Of Dining Table</small>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="dining"
                    min="0"
                    {...register("dining", { required: true, maxLength: 150 })}
                    style={{
                      backgroundColor: "ghostwhite",
                    }}
                  />
                </div>
              )}
              {hotel && (
                <div>
                  <label htmlFor="">
                    <small>Add Number Of Dining Table</small>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="dining"
                    min="0"
                    {...register("dining", { required: true, maxLength: 150 })}
                    style={{
                      backgroundColor: "ghostwhite",
                    }}
                    required
                  />
                  <label htmlFor="" className="mt-3">
                    <small>Add Number Of Hotel Rooms</small>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    name="room"
                    {...register("room", { required: true, maxLength: 150 })}
                    style={{
                      backgroundColor: "ghostwhite",
                    }}
                    required
                  />
                </div>
              )}
              <div className="form-group mb-5 mt-2">
                <button
                  type="submit"
                  className="btn btn-grad"
                  style={{ float: "right" }}
                >
                  <h3 className="m-0">
                    <small>Sign Up</small>
                  </h3>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubAdmin;
