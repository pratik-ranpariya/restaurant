import React, { useState, useEffect } from "react";
import { BiRupee } from "react-icons/bi";
import { VscGithubAction } from "react-icons/vsc";
import { useGlobalContext } from "../../../context.js";
import { Line, Pie } from "react-chartjs-2";
import { FiUsers } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Graphs from "./Graphs.js";

const Dashboard = () => {
  const { isSidebarOpen, dashboardCount, size } = useGlobalContext();

  const [countData, setCountData] = useState({
    active: 0,
    inactive: 0,
    renue: 0,
    totalorder: 0,
    deleveredorder: 0,
    cancleorder: 0,
  });

  useEffect(async () => {
    const getToken = localStorage.getItem("user");
    var myToken = JSON.parse(getToken);

    const fetchApi = await axios.get(dashboardCount, {
      headers: { Authorization: myToken.token },
    });

    if (fetchApi.status === 200) {
      setCountData(fetchApi.data.data);
    } else {
    }
  }, []);

  const progress1 = countData.active + countData.inactive + countData.renue;
  const progress2 =
    countData.totalorder + countData.deleveredorder + countData.cancleorder;

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}
      >
        <div
          className={`${
            size <= 1000
              ? "row justify-content-center px-3 zzz"
              : "row justify-content-between px-3 zzz"
          }`}
        >
          <div
            className="col4 d-flex justify-content-between py-3 px-3 m-1 my_col"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.active}</h3>
              <p className="m-0">Active</p>
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
                      (countData.active / progress1) * 100
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
              <h3 className="">{countData.inactive}</h3>
              <p className="m-0">inActive</p>
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
                      (countData.inactive / progress1) * 100
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
              <h3 className="">{countData.renue}</h3>
              <p className="m-0">Renue</p>
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
                      (countData.renue / progress1) * 100
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
          className={`${
            size <= 1000
              ? "row justify-content-center px-3 zzz"
              : "row justify-content-between px-3 zzz"
          }`}
        >
          <div
            className="col4 d-flex justify-content-between py-3 px-3 m-1 my_col"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.totalorder}</h3>
              <p className="m-0">Total Order</p>
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
                      (countData.totalorder / progress2) * 100
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
              <h3 className="">{countData.deleveredorder}</h3>
              <p className="m-0">Delivered Order</p>
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
                      (countData.deleveredorder / progress2) * 100
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
              <h3 className="">{countData.cancleorder}</h3>
              <p className="m-0">Cancel Order</p>
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
                      (countData.cancleorder / progress2) * 100
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
          <div className="row mt-3">
            <Graphs all={countData.totalorder} delivered={countData.deleveredorder} cancle={countData.cancleorder}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
