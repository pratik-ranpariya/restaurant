import React, { useState } from "react";
import { useGlobalContext } from "../../../context.js";
import { useHistory } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const AddUPI = () => {
  const { addUPI, closeaddUPI, updateUPI } = useGlobalContext();

  const [paytm, setpaytm] = useState(false);
  const [phonepay, setphonepay] = useState(false);
  const [googlepay, setgooglepay] = useState(false);

  const addpaytm = () => {
    setpaytm(true);
    setgooglepay(false);
    setphonepay(false);
  };
  const addphonepay = () => {
    setpaytm(false);
    setgooglepay(false);
    setphonepay(true);
  };
  const addgooglepay = () => {
    setpaytm(false);
    setgooglepay(true);
    setphonepay(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);

      var wh = {}

      if(data.paytm_merchant_id){
        wh['paytm_merchant_id'] = data.paytm_merchant_id
      }
      if(data.paytm_merchant_key){
        wh['paytm_merchant_key'] = data.paytm_merchant_key
      }
      if(data.googlepay_merchant_id){
        wh['googlepay_merchant_id'] = data.googlepay_merchant_id
      }
      if(data.googlepay_merchant_name){
        wh['googlepay_merchant_name'] = data.googlepay_merchant_name
      }

      const result = await axios(updateUPI, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: wh,
      });
	   
      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        Swal.fire({
          title: "Done",
          text: user_Session_Data.msg,
          icon: "success",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
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
    <div className={`${addUPI ? "model-popup" : "none"}`}>
      <div className="model-wrap">
        <div className="model-body">
          <div className="model-content">
            <button className="clos-btn" onClick={closeaddUPI}>
              <FaTimes />
            </button>
            <div className="upi-input_popup">
              <div className="container">
                <h5 className="text-center mb-5">
                  <strong> Add UPI ID </strong>
                </h5>
                <div className="row">
                  <div className="col-sm">
                    <div className="row my-3 align-items-center">
                      <div className="col-5">
                        <input
                          type="radio"
                          name="hey"
                          id="hey1"
                          onClick={addpaytm}
                        />
                        <label htmlFor="hey1" className="m-0">
                          Paytm
                        </label>
                      </div>
                      {paytm && (
                        <div className="col-6 p-0 text-center">
                          <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <input 
                              className="row mb-1 m-0"
                              type="text"
                              name="paytm_merchant_id"
                              placeholder="Merchant Id"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                              {...register("paytm_merchant_id")}
                            />
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              name="paytm_merchant_key"
                              placeholder="Merchant Key"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              {...register("paytm_merchant_key")}
                              required
                            />
                            {/* <input
                              className="row mb-1 m-0"
                              type="text"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            /> */}
                            <div className="">
                              <button
                                type="submit"
                                htmlFor="hey1"
                                className="upi-Update_button border-transperant px-4"
                                style={{
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                  borderRadius:"10px"
                                }}
                              >
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                    {/* <div className="row my-3 align-items-center">
                      <input
                        type="radio"
                        name="hey"
                        id="hey2"
                        onClick={addphonepay}
                      />
                      <label htmlFor="hey2" className="m-0">
                        Phone Pay
                      </label>
                      {phonepay && (
                        <div className="ml-5">
                          <form action="" className="row">
                            <input
                              type="text"
                              style={{
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            />
                            <div className="ml-3">
                              <button
                                type="submit"
                                htmlFor="hey1"
                                className="upi-Update_button border-transperant px-4"
                                style={{
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                }}
                              >
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div> */}
                    <div className="row my-3 align-items-center">
                      <div className="col-5">
                        <input
                          type="radio"
                          name="hey"
                          id="hey3"
                          onClick={addgooglepay}
                        />
                        <label htmlFor="hey3">Google pay</label>
                      </div>
                      {googlepay && (
                        <div className="col-6 p-0 text-center">
                          <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              name="googlepay_merchant_id"
                              placeholder="Merchant Id"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              {...register("googlepay_merchant_id")}
                              required
                            />
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              name="googlepay_merchant_name"
                              placeholder="Merchant Name"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              {...register("googlepay_merchant_name")}
                              required
                            />
                            {/* <input
                              className="row mb-1 m-0"
                              type="text"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            /> */}
                            <div className="">
                              <button
                                type="submit"
                                htmlFor="hey1"
                                className="upi-Update_button border-transperant px-4"
                                style={{
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                  borderRadius:"10px"
                                }}
                              >
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUPI;

