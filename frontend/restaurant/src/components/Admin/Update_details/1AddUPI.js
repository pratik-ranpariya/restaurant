import React, { useState } from "react";
import { useGlobalContext } from "../../../context.js";
import { useHistory } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddUPI = () => {
  const { addUPI, closeaddUPI } = useGlobalContext();

  const [paytm, setpaytm] = useState(false);
  const [googlepay, setgooglepay] = useState(false);

  const addpaytm = () => {
    setpaytm(true);
    setgooglepay(false);
  };
  const addgooglepay = () => {
    setpaytm(false);
    setgooglepay(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
                          <form>
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            />
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            />
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            />
                            <div className="">
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
                        <label htmlFor="hey3">Google Pay</label>
                      </div>
                      {googlepay && (
                        <div className="col-6 p-0 text-center">
                          <form>
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            />
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            />
                            <input
                              className="row mb-1 m-0"
                              type="text"
                              style={{
                                width: "100%",
                                outline: "none",
                                backgroundColor: "ghostwhite",
                                border: " 1px solid lightgray",
                              }}
                              required
                            />
                            <div className="">
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
