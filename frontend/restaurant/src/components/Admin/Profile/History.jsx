import React, { useEffect } from "react";
import { useState } from "react";
import { useGlobalContext } from "../../../context.js";
import axios from "axios";
import Swal from 'sweetalert2'

const History = () => {
  const { subhistory } = useGlobalContext();
  const [data, setdata] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const getToken = localStorage.getItem("user");
        var myToken = JSON.parse(getToken);
  
        const fetchApi = await axios.get(subhistory, {
          headers: { Authorization: myToken.token },
        });
  
        if (fetchApi.data.status === 200) {
          setdata(fetchApi.data.data);
        } else {
          Swal.fire({
            title: "ohh no!",
            text: fetchApi.data.msg,
            icon: "error",
            confirmButtonColor: 'rgb(234, 122, 154)'
          })
        }
      } catch (e) {
        Swal.fire({
          title: "ohh no!",
          text: e.message,
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    })();
  }, []);

  return (
    <>
      <div className="row mb-5 mt-4">
        <h4
          className="col-sm font-weight-bolder m-0"
          style={{ color: "#ea7a9a" }}
        >
          History
        </h4>
      </div>
      {data.map((datas) => {
        return (
          <>
            <div className="row mt-3 text-md-left text-center">
              <div
                className="col-sm font-weight-bold"
                style={{
                  lineHeight: "1.3rem",
                }}
              >
                {datas.start_date}
              </div>
              <div
                className="col-sm font-weight-bold"
                style={{
                  lineHeight: "1.3rem",
                }}
              >
                {datas.end_date}
              </div>
              <div
                className="col-sm text-capitalize font-weight-bold"
                style={{
                  lineHeight: "1.3rem",
                }}
              >
                {datas.subcription_type}
              </div>
              <div
                className="col-sm font-weight-bold"
                style={{ color: "#ea7a9a", lineHeight: "1.3rem" }}
              >
                {datas.price === 0 ? 'Free' : datas.price}
              </div>
              <div
                className="col-sm text-capitalize font-weight-bold"
                style={{
                  color:
                    datas.action === "running"
                      ? "#ea7a9a"
                      : datas.action === "accepted"
                      ? "green"
                      : datas.action === "complated"
                      ? "green"
                      : "red",
                  lineHeight: "1.3rem",
                }}
              >
                {datas.action}
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default History;
