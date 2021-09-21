import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import noneveg from "./non-veg.jpg";
import veg from "./veg.png";
import axios from "axios";
import { useGlobalContext } from "../../context";

const BillDetails = () => {
  const { incart, total, increase, decrease, total_quantity, onSubmit } =
  useGlobalContext();
  let history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const [logo, setlogo] = useState({});

  const apiLink = localStorage.getItem("api");

  const callApis = async () => {
    const result = await axios(apiLink);
    if (result.status === 200) {
      setlogo(result.data.data);
    } else {
    }
  };
  
 // if(!total_quantity){
 //   history.push("/");
 // }

  useEffect(() => {
    callApis();
  }, []);

  // const initialState = {
  //   mkpymt: {},
  // };
  // const [state, dispatch] = useReducer(reducer, initialState);

  // if (mkpymt.restaurant_id) {
  //   const bbb = async () => {
  //     const API = "http://64.225.86.46:4000/users/order";

  //     const callAPI = await axios.post(API, mkpymt);
  //     if (callAPI.data.status === 200) {
  //       const nullvalue = {};
  //       localStorage.removeItem("menu");
  //       // window.location = "http://64.225.86.46:3002/";
  //       window.location = "http://localhost:3000/";
  //       console.log(callAPI.data.data);
  //     } else {
  //       console.log(callAPI.data.msg);
  //     }
  //   };
  //   bbb();
  // }

  return (
    <>
      <div className="container">
        <header style={{ height: "60px" }}>
          <div
            style={{
              display: "flex",
              padding: "15px 0px",
              alignItems: "center",
            }}
          >
            <Link to="/">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: "rgb(223, 220, 220)",
                  marginRight: "10px",
                }}
              >
                <i
                  className="fa fa-angle-left 2x"
                  style={{ color: "black" }}
                  aria-hidden="true"
                ></i>
              </button>
            </Link>
            <img
              src={logo.restaurent_logo}
              alt="abc"
              style={{
                height: "50px",
                width: "50px",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />
            <h4 style={{ wordWrap: "break-word" }}>
              <strong>{logo.name}</strong>
            </h4>
          </div>
        </header>
        <hr />
      </div>
      {incart.map((items,index) => {
        const {image, name, sizequentity, category, size, price, sizeid } =
          items;
        return (
          <>
            <div  key={index} style={{ padding: "0px 6px 0px 24px" }}>
              <div
                className="container mb-3 pl-2"
                style={{
                  background: "#fff",
                  borderRadius: "17px",
                  border: "1px solid ghostwhite",
                  boxShadow: "0px 20px 20px 0px rgb(0 0 0 / 10%)",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ padding: "10px 0px" }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={image}
                      alt={name}
                      style={{
                        maxWidth: "70px",
                        height: "70px",
                        borderRadius: "17px",
                        objectFit: "cover",
                        marginLeft: "-27px",
                      }}
                    />
                    <div
                      className="d-inline-flex flex-column pr-2"
                      style={{
                        marginLeft: "15px",
                        float: "right",
                        maxWidth: "400px",
                        width: "81%",
                      }}
                    >
                      <h6 style={{ fontSize: "0.8rem" }}>
                        <strong>{name}</strong>
                      </h6>
                      <h6 style={{ color: "gray" }}>{size}</h6>

                      <div className="d-flex align-items-center">
                        {category === "non-veg" ? (
                          <img src={noneveg} width="15px" alt="" />
                        ) : (
                          <img src={veg} width="15px" alt="" />
                        )}
                        <h6
                          className="m-0 ml-1"
                          style={{ fontSize: "14px", fontWeight: 700 }}
                        >
                          <BiRupee size={18} />
                          {price}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-3 ">
                    <div style={{ float: "right" }}>
                      {sizequentity <= 0 ? (
                        <input
                          type="button"
                          style={{
                            backgroundColor: "#4aa90f",
                            borderColor: "transparent",
                            width: "35px",
                            height: "35px",
                            borderRadius: "40px",
                            fontWeight: "800",
                            fontSize: "20px",
                          }}
                          className=" text-white "
                          defaultValue="+"
                          onClick={() => increase(sizeid)}
                        />
                      ) : (
                        <div
                          className="d-flex flex-column"
                          style={{
                            background: " #4aa90f",
                            borderRadius: "20px",
                          }}
                        >
                          <span
                            className="text-center text-white"
                            style={{ cursor: "pointer" }}
                            onClick={() => increase(sizeid)}
                          >
                            +
                          </span>
                          <span
                            style={{
                              width: "35px",
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            {sizequentity}
                          </span>
                          <span
                            className="text-center text-white"
                            style={{ cursor: "pointer" }}
                            onClick={() => decrease(sizeid)}
                          >
                            -
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}

      <div className="coupen">
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">
                <strong>Cooking Instruction</strong>
              </label>
              <div className="display">
                <textarea
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter discount code"
                  {...register("desc", { required: true, maxLength: 150 })}
                ></textarea>

                <button type="submit" className="btn btn-primary">
                  <strong>APPLY</strong>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="container">
        <div className="row pl-3">
          <h4>
            <strong>Bill Details</strong>
          </h4>
        </div>
        <div className="row mt-4">
          <div className="col-8">
            <h6 style={{ color: "gray" }}>
              <strong>Total Item</strong>
            </h6>
          </div>
          <div className="col-4 text-right">
            <h6>
              <strong>{total_quantity}</strong>
            </h6>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-8">
            <h6 style={{ color: "gray" }}>
              <strong>Amount</strong>
            </h6>
          </div>
          <div className="col-4 text-right">
            <h6>
              <strong>{total}</strong>
            </h6>
          </div>
        </div>
        {/* <div className="row mt-2">
          <div className="col-8">
            <h6 style={{ color: "gray" }}>
              <strong>Restaurant Charges</strong>
            </h6>
          </div>
          <div className="col-4 text-right">
            <h6>
              <strong>1.00</strong>
            </h6>
          </div>
        </div> */}
        <div className="row mt-2">
          <div className="col-8">
            <h6 style={{ color: "gray" }}>
              <strong>GST Charge</strong>
            </h6>
          </div>
          <div className="col-4 text-right">
            <h6>
              <strong>{(total * 18) / 100}</strong>
            </h6>
          </div>
        </div>
        <hr className="my-2" />
        <div className="row">
          <div className="col-8">
            <h5>
              <strong>To Pay</strong>
            </h5>
          </div>
          <div className="col-4 text-right font-weight-bold ">
            <h5>
              <strong>{(total + (total * 18) / 100).toFixed(2)}</strong>
            </h5>
          </div>
        </div>
        <hr className="my-2" />
      </div>

      <div className="d-inline-block" style={{ height: "50px" }}>
        <footer
          style={{
            backgroundColor: "#f51929",
            position: "fixed",
            width: "100vw",
            bottom: 0,
          }}
        >
          {total_quantity > 0 ? (
            <Link to="/payment">
              <div className="container">
                <button
                  type="button"
                  className="btn btn-primary btn-block text-center"
                  style={{ backgroundColor: "#f51929", border: "none" }}
                >
                  <strong>Make Payment</strong>
                </button>
              </div>
            </Link>
          ) : (
            <div className="container">
              <button
                disabled
                type="button"
                className="btn btn-primary btn-block text-center"
                style={{ backgroundColor: "#f51929", border: "none" }}
              >
                <strong>Make Payment</strong>
              </button>
            </div>
          )}
        </footer>
      </div>
    </>
  );
};

export default BillDetails;
