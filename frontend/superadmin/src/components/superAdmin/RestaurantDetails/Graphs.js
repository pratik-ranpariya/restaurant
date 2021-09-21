import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import { BiRupee } from "react-icons/bi";
import { useGlobalContext } from "../../../context.js";
import axios from "axios";
import Swal from "sweetalert2";

const Graphs = (restaurant_id) => {
  const { graph, restaurant_graph } = useGlobalContext();

  const [graphdata, setgraphData] = useState([]);

  useEffect(async () => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
  
      const graphApi = await axios.get(
        restaurant_graph + "?restaurant_id=" + restaurant_id.id,
        {
          headers: { Authorization: myToken.token },
        }
      );
  
      if (graphApi.data.status === 200) {
        await setgraphData(graphApi.data.data);
      } else {
        Swal.fire({
          title: "Ohh no!",
          text: graphApi.data.msg,
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

  var arraygraph = [];
  var total_counter = 0;
  for (let i = 0; i < graphdata.length; i++) {
    arraygraph.push(graphdata[i].count);
    total_counter += graphdata[i].count;
  }
  return (
    <>
      <div
        className="col-sm mr-5 mt-1"
        style={{
          border: "2px solid ghostwhite",
          // maxWidth: "650px",
        }}
      >
        <h5 className="mt-3">Revenue</h5>
        <div>
          <Line
            data={{
              labels: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
              ],
              datasets: [
                {
                  label: "Order",
                  // data: arraygraph,
                  data: arraygraph,
                  backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                  borderColor: ["rgba(255, 99, 132, 1)"],
                  borderWidth: 1,
                  tension: 0.5,
                  fill: {
                    target: "origin",
                    above: "#ea7b9b90",
                    below: "rgb(0, 0, 255)",
                  },
                },
              ],
            }}
            width={50}
            height={330}
            options={{
              maintainAspectRatio: false,
              curveType: "function",
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
      <div className="col-sm mt-1" style={{ border: "2px solid ghostwhite" }}>
        <h5 className="mt-3">Order Summary</h5>
        <div className="row d-flex justify-content-center align-items-center  mt-4 pt-2">
          <div className="col-7" style={{ minWidth: "200px " }}>
            {/* {countData.cancel === 0 &&
            countData.pending === 0 &&
            countData.delevered === 0 ? (
              "No Orders "
            ) : ( */}
            <Pie
              data={{
                // labels: ["On Delivery", "Delivered", "Canceled"],
                datasets: [
                  {
                    label: "My First Dataset",
                    data: [
                      restaurant_id.all,
                      restaurant_id.delivered,
                      restaurant_id.cancle,
                    ],
                    backgroundColor: [
                      "rgb(54, 162, 235)",
                      "rgb(255, 99, 132)",
                      "rgb(255, 205, 86)",
                    ],
                    hoverOffset: 4,
                  },
                ],
              }}
              style={{
                // maxHeight: "200px",
                maxWidth: "200px",
                maxHeight: "200px",
                minWidth: "150px",
                minHeight: "150px",
              }}
            />
            {/* )} */}
          </div>
          <div className="col-5 text-center mt-2">
            <strong>
              {" "}
              <BiRupee size={15} style={{ marginTop: "-3px" }} />
              {arraygraph[new Date().getDate() - 1]}
            </strong>
            <p style={{ color: "grey" }}>
              from <BiRupee size={15} />
              {total_counter.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="row mt-2">
          <div
            className="col-sm mx-2 pt-2 my-1"
            style={{
              border: "2px solid ghostwhite",
              borderRadius: "10px",
            }}
          >
            <h6>
              <strong>{restaurant_id.all}</strong>
            </h6>
            <p style={{ color: "grey" }}>All Orders</p>
          </div>
          <div
            className="col-sm mx-2 pt-2 my-1"
            style={{
              border: "2px solid ghostwhite",
              borderRadius: "10px",
            }}
          >
            <h6>
              <strong>{restaurant_id.delivered}</strong>
            </h6>
            <p style={{ color: "grey" }}>Delivered</p>
          </div>
          <div
            className="col-sm mx-2 pt-2 my-1"
            style={{
              border: "2px solid ghostwhite",
              borderRadius: "10px",
            }}
          >
            <h6>
              <strong>{restaurant_id.cancle}</strong>
            </h6>
            <p style={{ color: "grey" }}>Canceled</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Graphs;
