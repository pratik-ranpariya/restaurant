import React, { useState, useEffect } from "react";
import { BiRupee } from "react-icons/bi";
import { VscGithubAction } from "react-icons/vsc";
import { useGlobalContext } from "../../../context.js";
import { FiUsers } from "react-icons/fi";
import axios from "axios";
import Graphs from "./Graphs.js";
import SubsciptionTable from "./SubsciptionTable";
import Swal from "sweetalert2";
import CurrentPlan from "./CurrentPlan"

const Restaurant = (id) => {
  const { isSidebarOpen, restaurant_dashboard, size } = useGlobalContext();

  const [countData, setCountData] = useState({
    allorder: 0,
    monthlyorder: 0,
    acceptedorder: 0,
    cancleorder: 0,
  });

  useEffect(async () => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      const fetchApi = await axios.get(
        restaurant_dashboard + "?restaurant_id=" + id.id,
        {
          headers: { Authorization: myToken.token },
        }
      );
  
      if (fetchApi.data.status === 200) {
        setCountData(fetchApi.data.data);
      } else {
        Swal.fire({
          title: "Ohh no!",
          text: fetchApi.data.msg,
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } catch (e) {
      Swal.fire({
        title: "Ohh no!",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  }, []);

  return (
    <>
      <div className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}>
        <div
          className="row justify-content-between px-3 zzzR"
        >
          <div
            className="col4 d-flex justify-content-between py-3 px-3 my-1 my_colR"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.allorder}</h3>
              <p className="m-0">Total Orders</p>
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
                    data-percentage={countData.allorder}
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
            className="col4 d-flex justify-content-between py-3 px-3 my-1 my_colR"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.monthlyorder}</h3>
              <p className="m-0">Monthly Order</p>
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
                    data-percentage={countData.monthlyorder}
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
            className="col4 d-flex justify-content-between py-3 px-3 my-1 my_colR"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.acceptedorder}</h3>
              <p className="m-0">Accepted Orders</p>
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
                    data-percentage={countData.acceptedorder}
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
          <div
            className="col4 d-flex justify-content-between py-3 px-3 my-1 my_colR"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <div className="text-white">
              <h3 className="">{countData.cancleorder}</h3>
              <p className="m-0">Cancel Orders</p>
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
                    data-percentage={countData.cancleorder}
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
            <Graphs
              id={id.id}
              all={countData.allorder}
              delivered={countData.acceptedorder}
              cancle={countData.cancleorder}
            />
          </div>
        </div>

        <div
          className="container2 mt-4 px-5"
          style={{
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <div className="row mt-3 justify-content-center">
            <CurrentPlan id={id.id}/>
          </div>
        </div>

      <div
          className="container2 mt-4 py-3 px-5"
          style={{
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <div className="row mt-3">
            <SubsciptionTable id={id.id}/>
          </div>
        </div>
	  </div>
    </>
  );
};

export default Restaurant;
