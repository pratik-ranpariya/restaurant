import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import noneveg from "./non-veg.jpg";
import veg from "./veg.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useGlobalContext } from "../../context";
import Receipt from "../Receipt/Receipt";
import axios from 'axios'

// const API = "http://64.225.86.46:4000/users/order";

const Myorders = () => {
  const { incart } = useGlobalContext();

  const [OrderID, setOrderID] = useState({
    "type": {
        "table_number": null,
        "room_number": null,
        "type": "take_away"
    },
    "start_time": "",
    "end_time": null,
    "status": "",
    "desc": "",
    "_id": "",
    "restaurant_id": "",
    "totalprice": 0,
    "payment_type": "",
    "payment_status": "",
    "item": [
        {
            "size": "",
            "_id": "",
            "name": "",
            "price": 0,
            "quentity": 0
        }
    ],
    "order_id": 0,
    "__v": 0
});

  let history = useHistory();

  const [locationKeys, setLocationKeys] = useState([]);

   useEffect(() => {
     return history.listen((location) => {
       if (history.action === "PUSH") {
         setLocationKeys([location.key]);
       }

       if (history.action === "POP") {
         if (locationKeys[1] === location.key) {
           setLocationKeys(([_, ...keys]) => keys);
           // Handle forward event
         } else {
           setLocationKeys((keys) => [location.key, ...keys]);

           // Handle back event
           history.push("/");
           localStorage.setItem("desc", JSON.stringify({}));
           window.location.reload();
         }
       }
     });
   }, [locationKeys,history]);

  useEffect(() => {
    setTimeout(async () => {
      var orderDatas = JSON.parse(localStorage.getItem("orderDetail"));
      console.log(orderDatas.data.order_id);
      const ifTransSuccess = await axios.get('https://app.scannmenu.com/users/checkorders?order_id='+orderDatas.data.order_id);
    if (ifTransSuccess.data.status === 200) {
      console.log(ifTransSuccess, '----');
      if(ifTransSuccess.data.data.payment_status !== 'failed'){
      localStorage.removeItem("menu")
      setOrderID(ifTransSuccess.data.data)
      makeReceipt()
      } else {
        history.push("/");
      }
    } else {
      alert(ifTransSuccess.data.msg)
      history.push("/");
    }
    }, 800);
  }, []);

  const makeReceipt = () => {
    setTimeout(() => {
      exportPdf();
    }, 900);
  }

  const exportPdf = () => {
    html2canvas(document.querySelector("#capture")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a1");
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("download.pdf");
    });
  };
/*
  useEffect(() => {
    setTimeout(() => {
      exportPdf();
    }, 900);
  }, []);
*/
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

  // console.log(OrderID);



  // if (Object.keys(mkpymt).length) {
  //   const makePayment = async () => {
  //     const API = "http://64.225.86.46:4000/users/order";

  //     const callAPI = await axios.post(API, mkpymt);
  //     if (callAPI.data.status === 200) {
  //       // const nullvalue = {};
  //       localStorage.removeItem("menu");
  //       localStorage.setItem("orderDetail", JSON.stringify(callAPI.data));
  //       const orderData = JSON.parse(localStorage.getItem("orderDetail"));
  //       // window.location = "http://64.225.86.46:3002/";
  //       // window.location = "http://localhost:3000/myorders";
  //       // dispatch({ type: "NULL_MKPYMT" });
  //       // setorderDetail(orderData.data);
  //       console.log(orderData.data, "local");
  //     } else {
  //       console.log(callAPI.data.msg);
  //     }
  //   };
  //   makePayment();
  // }
  // console.log(orderDetail, "state");

  return (
    <>
      <div>
        <div className="container mt-4">
          <div className="d-flex">
            <div>
              <h5
                className="font-weight-bold ml-2"
                style={{ color: "#8492a6" }}
              >
                My Order
              </h5>
            </div>
          </div>
          <hr />
        </div>
        {OrderID.item.map((items) => {
          const {
            image,
            name,
            category,
            size,
            price,
          } = items;
          return (
            <>
              <div style={{ padding: "0px 6px 0px 24px" }}>
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
                  </div>
                </div>
              </div>
            </>
          );
        })}
        <div className="container pt-3" style={{ background: "#f9f9f9" }}>
          <p className="m-0" style={{ color: "gray" }}>
            Order ID : {OrderID.order_id}
          </p>
          {OrderID.item.map((items) => {
            const { name, quentity, size } = items;
            return (
              <>
                <h6 className="m-0">
                  <strong>
                    {name} <small>{size}</small> x {quentity},
                  </strong>
                </h6>
              </>
            );
          })}
          <p style={{ color: "gray" }}>
            {new Date().getDate()} {months[new Date().getMonth()]}{" "}
            {new Date().getFullYear()}
          </p>
          <button
            type="button"
            className="btn font-weight-bold mt-2 ml-1"
            style={{
              padding: "5px 40px",
              color: "red",
              borderRadius: "8px",
              border: "1px solid red",
            }}
            onClick={() => {
              history.push("/");
              window.location.reload();
            }}
          >
            Reorder
          </button>
          <button
            type="button"
            className="btn font-weight-bold ml-1 mt-2"
            style={{
              padding: "5px 29px",
              color: "green",
              borderRadius: "8px",
              border: "1px solid green",
            }}
            onClick={() => {
              exportPdf();
            }}
          >
            Download
          </button>
        </div>
      </div>
      <Receipt OrderID={OrderID} />
    </>
  );
};

export default Myorders;

