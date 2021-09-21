import React, { useEffect } from "react";
import { useGlobalContext } from "../../../context.js";
import axios from "axios";
import Swal from "sweetalert2";

const Restaurant = () => {
  const { subcriptionplan } = useGlobalContext();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  });

  async function Razorpay(subcription_type, month, price) {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      var data = await axios("https://app.scannmenu.com/restaurants/razorpay", {
        headers: {
          Authorization: myToken.token,
          "Content-type": "application/json",
        },
        method: "POST",
        data: JSON.stringify({ price: price }),
      });
      data = data.data;

      if (data.status !== 200) {
        return Swal.fire({
          title: "Ohh no!",
          text: data.msg,
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        });
      } else {
        const options = {
          key: "rzp_test_0jdmCXlJsGl7x1",
          currency: data.currency,
          amount: data.amount,
          name: "scan n menu",
          description: "Wallet Transaction",
          order_id: data.id,
          handler: async function (response) {
            var subdata = {
              month: month,
              subcription_type: subcription_type,
              price: price,
            };
            const result = await axios(subcriptionplan, {
              headers: { Authorization: myToken.token },
              method: "POST",
              data: subdata,
            });

            if (result.data.status === 200) {
              // console.log(result.data);
            } else {
              return Swal.fire({
                title: "Ohh no!",
                text: result.data.msg,
                icon: "error",
                confirmButtonColor: 'rgb(234, 122, 154)'
              });
            }
          },
          prefill: {
            name: "scannmenu",
            email: "scannmenu@gmail.com",
            contact: "9999999999",
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (e) {
      return Swal.fire({
        title: "Ohh no!",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      });
    }
  }
  return (
    <>
      <div className="row m-0 p-0 text-center">
        <div className="my-5 col-sm text-center ">
          <div
            className="my_content text-center shadow"
            style={{
              width: "300px",
              borderRadius: "10px",
              minWidth: "280px",
              margin: "0 auto",
            }}
          >
            <div
              className="card-body text-white"
              style={{
                backgroundColor: "#e87999",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <h5 className="card-title ">
                <strong>3 MONTH</strong>
              </h5>
              <h6 className="card-title">75 Days + 15 days</h6>
              <button
                className="px-4 py-1 text-white font-weight-bold"
                style={{
                  backgroundColor: "#9d3f5a",
                  border: "none",
                  outline: "none",
                  cursor: "unset",
                  borderRadius: "5px",
                }}
              >
                12,500 Rs/-
              </button>
            </div>
            <div
              className="text-white p-1"
              style={{ backgroundColor: "black" }}
            >
              <h6 className="font-weight-bold p-0 m-0">15 Days Free</h6>
            </div>
            <div className=" d-flex justify-content-center">
              <div className="container" style={{ backgroundColor: "white" }}>
                <ul className=" list-group list-group-flush">
                  <li className="list-group-item mt-2">
                    <small>Initial Setup</small>
                  </li>
                  <li className="list-group-item">
                    <small>Check Order Status</small>
                  </li>
                  <li className="list-group-item">
                    <small>Update Menu Any Time</small>
                  </li>
                  <li className="list-group-item">
                    <small>Update Information</small>
                  </li>
                  <li className="list-group-item">
                    <small>Order Printing</small>
                  </li>
                  <li className="list-group-item">
                    <small>Invoice Generation</small>
                  </li>
                  <li className="list-group-item">
                    <small>Notification</small>
                  </li>
                  <li className="list-group-item">
                    <small>Integrated Payment Gateways</small>
                  </li>
                  <li className="list-group-item">
                    <small>Analysis Reports</small>
                  </li>
                  <li className="list-group-item">
                    <small>Chat System</small>
                  </li>
                  <li className="list-group-item">
                    <small>Unlimited Numbers Of Scans</small>
                  </li>
                  <li className="list-group-item">
                    <small>Provides a Restaurant QR Code & Table Qr Code</small>
                  </li>
                  <li className="list-group-item">
                    <small>Best For Take Away and Dine in Restaurants</small>
                  </li>
                  <li className="list-group-item">
                    <small>24*7 Support</small>
                  </li>
                  <li className="list-group-item mb-3">
                    <button
                      className="btn subscribe"
                      style={{
                        background: "#ea7a9a",
                        color: "white",
                        borderRadius: 10,
                        letterSpacing: "1.5px",
                        // padding: "10px 30px 10px 10px",
                      }}
                      onClick={() => Razorpay("dining_table", 3, 12500)}
                    >
                      {" "}
                      <h3 className="m-0 p-2">
                        <strong> Subscribe </strong>{" "}
                      </h3>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="my-5 col-sm text-center ">
          <div
            className="my_content text-center shadow"
            style={{
              width: "300px",
              borderRadius: "10px",
              minWidth: "280px",
              margin: "0 auto",
            }}
          >
            <div
              className="card-body text-white"
              style={{
                backgroundColor: "#e87999",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <h5 className="card-title ">
                <strong>6 MONTH</strong>
              </h5>
              <h6 className="card-title">5 Month + 1 Month</h6>
              <button
                className="px-4 py-1 text-white font-weight-bold"
                style={{
                  backgroundColor: "#9d3f5a",
                  border: "none",
                  outline: "none",
                  cursor: "unset",
                  borderRadius: "5px",
                }}
              >
                25,000 Rs/-
              </button>
            </div>
            <div
              className="text-white p-1"
              style={{ backgroundColor: "black" }}
            >
              <h6 className="font-weight-bold p-0 m-0">1 Month Free</h6>
            </div>
            <div className=" d-flex justify-content-center">
              <div className="container" style={{ backgroundColor: "white" }}>
                <ul className=" list-group list-group-flush">
                  <li className="list-group-item mt-2">
                    <small>Initial Setup</small>
                  </li>
                  <li className="list-group-item">
                    <small>Check Order Status</small>
                  </li>
                  <li className="list-group-item">
                    <small>Update Menu Any Time</small>
                  </li>
                  <li className="list-group-item">
                    <small>Update Information</small>
                  </li>
                  <li className="list-group-item">
                    <small>Order Printing</small>
                  </li>
                  <li className="list-group-item">
                    <small>Invoice Generation</small>
                  </li>
                  <li className="list-group-item">
                    <small>Notification</small>
                  </li>
                  <li className="list-group-item">
                    <small>Integrated Payment Gateways</small>
                  </li>
                  <li className="list-group-item">
                    <small>Analysis Reports</small>
                  </li>
                  <li className="list-group-item">
                    <small>Chat System</small>
                  </li>
                  <li className="list-group-item">
                    <small>Unlimited Numbers Of Scans</small>
                  </li>
                  <li className="list-group-item">
                    <small>Provides a Restaurant QR Code & Table Qr Code</small>
                  </li>
                  <li className="list-group-item">
                    <small>Best For Take Away and Dine in Restaurants</small>
                  </li>
                  <li className="list-group-item ">
                    <small>24*7 Support</small>
                  </li>
                  <li className="list-group-item mb-3">
                    <button
                      className="btn subscribe"
                      style={{
                        background: "#ea7a9a",
                        color: "white",
                        borderRadius: 10,
                        letterSpacing: "1.5px",
                        // padding: "10px 30px 10px 10px",
                      }}
                      onClick={() => Razorpay("dining_table", 6, 25000)}
                    >
                      {" "}
                      <h3 className="m-0 p-2">
                        <strong> Subscribe </strong>{" "}
                      </h3>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="my-5 col-sm text-center ">
          <div
            className="my_content text-center shadow"
            style={{
              width: "300px",
              borderRadius: "10px",
              minWidth: "280px",
              margin: "0 auto",
            }}
          >
            <div
              className="card-body text-white"
              style={{
                backgroundColor: "#e87999",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <h5 className="card-title">
                <strong>1 YEAR</strong>
              </h5>
              <h6 className="card-title">10 Month + 2 Month</h6>
              <button
                className="px-4 py-1 text-white font-weight-bold"
                style={{
                  backgroundColor: "#9d3f5a",
                  border: "none",
                  outline: "none",
                  cursor: "unset",
                  borderRadius: "5px",
                }}
              >
                50,000 Rs/-
              </button>
            </div>
            <div
              className="text-white p-1"
              style={{ backgroundColor: "black" }}
            >
              <h6 className="font-weight-bold p-0 m-0">2 Month Free</h6>
            </div>
            <div className=" d-flex justify-content-center">
              <div className="container" style={{ backgroundColor: "white" }}>
                <ul className=" list-group list-group-flush">
                  <li className="list-group-item mt-2">
                    <small>Initial Setup</small>
                  </li>
                  <li className="list-group-item">
                    <small> Check Order Status</small>
                  </li>
                  <li className="list-group-item">
                    <small> Update Menu Any Time</small>
                  </li>
                  <li className="list-group-item">
                    <small> Update Information</small>
                  </li>
                  <li className="list-group-item">
                    <small> Order Printing</small>
                  </li>
                  <li className="list-group-item">
                    <small> Invoice Generation</small>
                  </li>
                  <li className="list-group-item">
                    <small> Notification</small>
                  </li>
                  <li className="list-group-item">
                    <small>Integrated Payment Gateways</small>
                  </li>
                  <li className="list-group-item">
                    <small>Analysis Reports</small>
                  </li>
                  <li className="list-group-item">
                    <small>Chat System</small>
                  </li>{" "}
                  <li className="list-group-item">
                    <small>Unlimited Numbers Of Scans</small>
                  </li>
                  <li className="list-group-item">
                    <small>Provides a Restaurant QR Code & Table Qr Code</small>
                  </li>
                  <li className="list-group-item">
                    <small>Best For Take Away and Dine in Restaurants</small>
                  </li>
                  <li className="list-group-item">
                    <small>24*7 Support</small>
                  </li>
                  <li className="list-group-item mb-3">
                    <button
                      className="btn subscribe"
                      style={{
                        background: "#ea7a9a",
                        color: "white",
                        borderRadius: 10,
                        letterSpacing: "1.5px",
                        // padding: "10px 30px 10px 10px",
                      }}
                      onClick={() => Razorpay("dining_table", 12, 50000)}
                    >
                      {" "}
                      <h3 className="m-0 p-2">
                        <strong> Subscribe </strong>{" "}
                      </h3>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant;
