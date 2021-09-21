import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AppContext, useGlobalContext } from "../../../context.js";
import { useForm } from "react-hook-form";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Swal from "sweetalert2";
import Loader from "react-loader-spinner";

/* firebase.initializeApp({
  apiKey: "AIzaSyB9ir88TBdApxuWJJJp7TWCAVs2VVS6LYM",
  authDomain: "scannmenu-a263c.firebaseapp.com",
  projectId: "scannmenu-a263c",
  storageBucket: "scannmenu-a263c.appspot.com",
  messagingSenderId: "205176802477",
  appId: "1:205176802477:web:2f5dfd006819d0fad20a24",
  databaseURL: "https://scannmenu-a263c-default-rtdb.firebaseio.com"
}) */

const AddSubAdmin = () => {

  const [dining, setdining] = useState(false);
  const [hotel, sethotel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [country, setCountry] = useState([])
  // const [state, setState] = useState('')
  // // const [city, setCity] = useState([])
  // // const [currentCountry, setCurrentCountry] = useState("India")
  // // const [currentState, setCurrentState] = useState('')
  const history = useHistory();

  const { isSidebarOpen, Add_SubAdmin, in_firebase_id } = useGlobalContext();

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

  // const getCountry = async () => {
  //   const result = await axios('https://www.universal-tutorial.com/api/countries', {
  //     headers: { 
  //       Accept: "application/json",
  //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJzY2Fubm1lbnVAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoielNoVEQyQjhaYzBnRXdtUFlzTlVwdnMwVXU4SnBqMFdLbWhwek4weVgwNTJvbl9EZXFYNDVEOTZQWmZJNm5nazl3TSJ9LCJleHAiOjE2MzA4MzgyNzl9.r7qAYllcnhGcBnMJd2T7kGiqFN_CA7YYWOBmIRKeIEM' 
  //     },
  //     method: "GET",
  //   })
  //   setCountry(result.data)
  // }

  // const getState = async () => {
  //   const results = await axios(`https://www.universal-tutorial.com/api/states/${currentCountry}`, {
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJzY2Fubm1lbnVAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoielNoVEQyQjhaYzBnRXdtUFlzTlVwdnMwVXU4SnBqMFdLbWhwek4weVgwNTJvbl9EZXFYNDVEOTZQWmZJNm5nazl3TSJ9LCJleHAiOjE2MzA4MzgyNzl9.r7qAYllcnhGcBnMJd2T7kGiqFN_CA7YYWOBmIRKeIEM' 
  //     },
  //     method: "GET",
  //   })
  //   // console.log(results.data);
  //   setState(results.data)
  // }

  // const getCity = async () => {
  //   const result = await axios(`https://www.universal-tutorial.com/api/cities/${currentState}`, {
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJzY2Fubm1lbnVAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoielNoVEQyQjhaYzBnRXdtUFlzTlVwdnMwVXU4SnBqMFdLbWhwek4weVgwNTJvbl9EZXFYNDVEOTZQWmZJNm5nazl3TSJ9LCJleHAiOjE2MzA4MzgyNzl9.r7qAYllcnhGcBnMJd2T7kGiqFN_CA7YYWOBmIRKeIEM' 
  //     },
  //     method: "GET",
  //   })
  //   setCity(result.data)
  // }

  // const getCountryData = (e)=> {
  //   console.log(e.target.value);
  //   setCurrentCountry(e.target.value)
  //   getState()
  // }

  // const getStateData = (e) => {
  //   setCurrentState(e.target.value)
  // }

  // useEffect(() => {
  //   getState()
  //   getCountry()
  // }, [])

  // useEffect(() => {
  //   getState()
  // }, [])

  // console.log(state);


  const onSubmit = async (data) => {
    try {
      if (data.confirmpassword === data.password) {
      let strongPassword = new RegExp(
          "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
        );
        if (strongPassword.test(data.password)) {
        setLoading(true)
        const getToken = localStorage.getItem("user");
        var myToken = JSON.parse(getToken);

        const result = await axios(Add_SubAdmin, {
          headers: { Authorization: myToken.token },
          method: "POST",
          data: data,
        });

        let user_Session_Data = result.data;
        if (user_Session_Data.status === 200) {

          const iii = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
          if (iii.user.uid) {
            const Updatefuid = await axios(in_firebase_id, {
              headers: { Authorization: myToken.token },
              method: "POST",
              data: { email: data.email, fuid: iii.user.uid },
            });
            if (Updatefuid.data.status === 200) {
              Swal.fire({
                title: "Done!",
                text: Updatefuid.data.msg,
                icon: "success",
                confirmButtonColor: 'rgb(234, 122, 154)'
              })
              setTimeout(() => {
                setLoading(false)
		      history.push("/AddSubscription");
                //window.location.reload(true)
              }, 3000);
            } else {
              setError(Updatefuid.data.msg);
            }
          }
        } else {
          setError(user_Session_Data.msg);
        }
	} else {
          Swal.fire({
            title: "ohh no!",
            text: "Password must be minimum 8 character, one special character, capital and number",
            icon: "error",
            confirmButtonColor: "rgb(234, 122, 154)",
          });
        }
      } else {
        Swal.fire({
          title: "ohh no!",
          text: 'password not match',
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } catch (error) {
      Swal.fire({
        title: "ohh no!",
        text: 'password not match',
        icon: error.message,
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };

  const label = {
    fontSize: '10px'
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
              <small>Add Restaurant</small>
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

            {
              loading ? (
                <div style={{ width: "100%", overflow: "none" }}>
                  {" "}
                  <Loader
                    className="text-center"
                    type="BallTriangle"
                    color="#ea7a9a"
                    height={80}
                    width={80}
                  />
                </div>
              ) :

                <form onSubmit={handleSubmit(onSubmit)}>

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
                      <label htmlFor="takeaway" className="ml-1" style={{ fontSize: "14px", margin: '10px' }}>
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

                      <label htmlFor="dining" className="ml-1" style={{ fontSize: "14px", margin: '10px' }}>
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
                      <label htmlFor="hotel" className="ml-1" style={{ fontSize: "14px", margin: '10px' }}>
                        Hotel
                      </label>
                    </div>
                  </div>


                  {dining && (
                    <div style={{ marginBottom: "14px" }}>
                      <label htmlFor="" style={{ fontSize: "14px" }}>
                        Add Number Of Dining Table
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
                    <div style={{ marginBottom: "14px" }}>
                      <label htmlFor="" style={{ fontSize: "14px" }}>
                        Add Number Of Dining Table
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
                      <label htmlFor="" className="mt-3" style={{ fontSize: "14px" }}>
                        Add Number Of Hotel Rooms
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

                  <div className="form-group">
                    <label htmlfor="exampleInputEmail1" style={{ fontSize: "14px" }}>Restaurant Name</label>
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
                    <label htmlfor="exampleInputEmail1" style={{ fontSize: "14px" }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      style={{ textTransform: "lowercase", backgroundColor: "ghostwhite" }}
                      name="email"
                      required
                      {...register("email", { required: true, maxLength: 150 })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlfor="exampleInputEmail1" style={{ fontSize: "14px" }}>User Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputUserName"
                      style={{textTransform: "lowercase", backgroundColor: "ghostwhite" }}
                      name="username"
                      required
                      {...register("username", { required: true, maxLength: 150 })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlfor="exampleInputPassword" style={{ fontSize: "14px" }}>Password</label>
                    <label htmlfor="exampleInputPassword" style={{ fontSize: "10px", float:"right", marginTop: "5px" }}>Password must be minimum 8 character, one special character, capital and number.</label>
		    <input
                      type="password"
                      className="form-control"
                      id="exampleInputPassword"
                      style={{ backgroundColor: "ghostwhite" }}
                      name="password"
                      minLength="6"
                      required
                      {...register("password", { required: true, maxLength: 150 })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlfor="exampleInputPassword1" style={{ fontSize: "14px" }}>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="exampleInputPassword1"
                      style={{ backgroundColor: "ghostwhite" }}
                      name="password"
                      minLength="6"
                      required
                      {...register("confirmpassword", { required: true, maxLength: 150 })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlfor="exampleInputPassword1" style={{ fontSize: "14px" }}>Mobile</label>
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
                    <label htmlfor="exampleInputEmail1" style={{ fontSize: "14px" }}>Address</label>
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
                    <label htmlfor="exampleInputEmail1" style={{ fontSize: "14px" }}>City</label>
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
                    <label htmlfor="exampleInputEmail1" style={{ fontSize: "14px" }}>State</label>
                    {/* <input
                  type="text"
                  className="form-control"
                  id="exampleInputState"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="state"
                  required
                  {...register("state", { required: true, maxLength: 150 })}
                /> */}

                    <select
                      className="form-control"
                      id="exampleInputName"
                      name="country"
                      style={{ backgroundColor: "ghostwhite", outline: "none" }}
                      required
                      {...register("state", { required: true })}
                    >
                      <option value="" selected disabled hidden>
                        Choose...
                      </option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
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
                  <div className="form-group">
                    <label htmlfor="exampleInputEmail1" style={{ fontSize: "14px" }}>Country</label>
                    {/* <input
                  type="text"
                  className="form-control"
                  id="exampleInputCountry"
                  style={{ backgroundColor: "ghostwhite" }}
                  name="country"
                  required
                  {...register("country", { required: true, maxLength: 150 })}
                /> */}

                    <select
                      className="form-control"
                      id="exampleInputName"
                      name="country"
                      style={{ backgroundColor: "ghostwhite", outline: "none" }}
                      required
                      {...register("country", { required: true })}
                    >
                      <option value="" selected disabled hidden>
                        Choose...
                      </option>
                      <option value="india" selected>
                        India
                      </option>
                      {/* {country.map((data) => {
                    return data.country_name === 'India'
                      ?
                      <option value={data.country_name} selected>{data.country_name}</option>
                      :
                      <option value={data.country_name} >{data.country_name}</option>
                  })} */}
                    </select>
                  </div>

                  <div className="form-group mb-5 mt-2">
                    <button
                      type="submit"
                      className="btn btn-grad"
                      style={{ float: "right" }}
                    >
                      <h3 className="m-0">
                        <small>Add</small>
                      </h3>
                    </button>
                  </div>
                </form>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubAdmin;
