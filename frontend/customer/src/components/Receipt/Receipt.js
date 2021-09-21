import React, { useState, useEffect } from "react";
import { BiRupee } from "react-icons/bi";
import { useGlobalContext } from "../../context";
import axios from "axios";

const Receipt = (OrderID) => {
  const { incart } =
    useGlobalContext();

  const [logo, setlogo] = useState({});
  const [total, settotal] = useState(0)

  const apiLink = localStorage.getItem("api");

  const callApis = async () => {
    const result = await axios(apiLink);
    if (result.status === 200) {
      setlogo(result.data.data);
    } else {
    }
  };

  const maketotal = async () => {
    // console.log(OrderID.OrderID);
    var amount = 0
    for (let i = 0; i < OrderID.OrderID.item.length; i++) {
      const element = OrderID.OrderID.item[i];
      amount += element.price * element.quentity
    }
    settotal(amount)
  };

  useEffect(() => {
    maketotal()
    callApis();
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      <div className="container pt-5" id="capture">
        <div className="d-flex justify-content-center">
          <div style={{ wordWrap: "break-word" }}>
            <h3>{logo.name}</h3>
          </div>
        </div>
        <div className="mt-4">
          <h6> Order_id: {OrderID.OrderID.order_id}</h6>
        </div>
        <div>
          <h6>
            {" "}
            {months[new Date().getMonth()]} {new Date().getDate()}{" "}
            {new Date().getFullYear()}
          </h6>
        </div>
        <div>
          <h6>
            {new Date().getHours()} : {new Date().getMinutes()}
          </h6>
        </div>
        <div className="row mt-4">
          {OrderID.OrderID.item.map((items) => {
            const {
              name,
              quentity,
              size,
              price,
            } = items;
            return (
              <>
                <hr className="my-2" />
                <div className="col-8">
                  <h6 style={{ fontSize: "0.8rem" }}>
                    <strong>
                      {name}
                      <small>
                        ({size}) x{quentity}
                      </small>
                    </strong>
                  </h6>
                </div>
                <div className="col-4 text-right">
                  <h6
                    className="m-0 ml-1"
                    style={{ fontSize: "14px", fontWeight: 700 }}
                  >
                    <BiRupee size={18} />
                    {price}
                  </h6>
                </div>
              </>
            );
          })}
        </div>
        <div className="row mt-2">
          <div className="col-8">
            <h6>
              <strong>Amount</strong>
            </h6>
          </div>
          <div className="col-4 text-right">
            <h6>
              <strong>{total}</strong>
            </h6>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-8">
            <h6>
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
    </>
  );
};

export default Receipt;

