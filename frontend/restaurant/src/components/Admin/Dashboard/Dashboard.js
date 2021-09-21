import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { VscGithubAction } from "react-icons/vsc";
import { AppContext, useGlobalContext } from "../../../context.js";
import Graphs from "./Graphs";
import { FiUsers } from "react-icons/fi";
import axios from "axios";
import QR from "./QR";
// import Popuptable from "./Popuptable.js";
import Accept from "./Popuptable/Accept.js";
import Cancel from "./Popuptable/Cancel.js";

const Dashboard = () => {
  const {
    isSidebarOpen,
    openaccept_order,
    opencancel_order,
    countData,
    todaydata,
  } = useGlobalContext();

  const progress = countData.delevered + countData.inprogress + countData.cancel;

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}
      >
        <div className="row justify-content-between px-3 zzz">
          <div
            className="col4 d-flex justify-content-between py-3 px-3 my-1 my_col"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.delevered}</h3>
              <p className="m-0">Order Delivered</p>
            </div>
            <div
              className="d-flex mt-1 align-items-center justify-content-center"
              style={{
                border: 0,
                backgroundColor: "white",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                textAlign: "center",
              }}
            >
              <div className="row progress_row">
                <div className="col-sm-3 col-md-2">
                  <div
                    className="progress mt-1"
                    data-percentage={parseInt(
                      (countData.delevered / progress) * 100
                    )}
                  >
                    <span className="progress-left">
                      <span className="progress-bar"></span>
                    </span>
                    <span className="progress-right">
                      <span className="progress-bar"></span>
                    </span>
                    <div className="progress-value">
                      <div>
                        <span>
                          <BiRupee size={25} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col4 d-flex justify-content-between py-3 px-3 my-1 my_col"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.inprogress}</h3>
              <p className="m-0">On Delivery</p>
            </div>
            <div
              className="d-flex mt-1 align-items-center justify-content-center"
              style={{
                border: 0,
                backgroundColor: "white",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                textAlign: "center",
              }}
            >
              <div className="row progress_row">
                <div className="col-sm-3 col-md-2">
                  <div
                    className="progress mt-1"
                    data-percentage={parseInt(
                      (countData.inprogress / progress) * 100
                    )}
                  >
                    <span className="progress-left">
                      <span className="progress-bar"></span>
                    </span>
                    <span className="progress-right">
                      <span className="progress-bar"></span>
                    </span>
                    <div className="progress-value">
                      <div>
                        <span>
                          <VscGithubAction size={20} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col4 d-flex justify-content-between py-3 px-3 my-1 my_col"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.cancel}</h3>
              <p className="m-0">Order Canceled</p>
            </div>
            <div
              className="d-flex mt-1 align-items-center justify-content-center"
              style={{
                border: 0,
                backgroundColor: "white",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                textAlign: "center",
              }}
            >
              <div className="row progress_row">
                <div className="col-sm-3 col-md-2">
                  <div
                    className="progress mt-1"
                    data-percentage={parseInt(
                      (countData.cancel / progress) * 100
                    )}
                  >
                    <span className="progress-left">
                      <span className="progress-bar"></span>
                    </span>
                    <span className="progress-right">
                      <span className="progress-bar"></span>
                    </span>
                    <div className="progress-value">
                      <div>
                        <span>
                          <FiUsers size={20} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="container2 mt-4 py-3 px-5"
          style={{
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <div className="row g-3">
            <button
              className="btn m-1 mr-3 my_btn"
              style={{
                background: "linear-gradient(to right, #ea7b9a, #fac7b6)",
                color: "white",
                borderRadius: "10px",
                letterSpacing: "1.5px",
                padding: "10px 30px 10px 10px",
              }}
              onClick={openaccept_order}
            >
              <strong> Accept Order</strong>
              <div className="accept_order">{countData.pending}</div>
            </button>
            <button
              className="btn m-1 my_btn"
              style={{
                background: "linear-gradient(to right, #ea7b9a, #fac7b6)",
                color: "white",
                borderRadius: "10px",
                letterSpacing: "1.5px",
                padding: "10px 30px 10px 10px",
              }}
              onClick={opencancel_order}
            >
              <strong>Cancel Order</strong>
              <div className="cancel_order">{countData.cancel}</div>
            </button>
          </div>
          <div className="row mt-3">
            <Graphs />
          </div>
          <div className="row mt-3">
            <QR />
          </div>
        </div>
      </div>
      <div>
        <Accept />
        <Cancel />
      </div>
    </>
  );
};

export default Dashboard;
