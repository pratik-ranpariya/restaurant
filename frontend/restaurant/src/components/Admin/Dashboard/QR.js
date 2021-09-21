import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { AppContext, useGlobalContext } from "../../../context.js";
import axios from "axios";
import Swal from 'sweetalert2'

const QR = () => {
  const { qrcode } = useGlobalContext();
  const [qrrestaurant, setqrrestaurantsData] = useState({});
  const [qrdining, setqrdiningData] = useState([]);
  const [qrrooms, setqrroomsData] = useState([]);
  const [showQR, setshowQR] = useState({
    id: 0,
    qr: "",
    name: "",
    status: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const getToken = localStorage.getItem("user");
        var myToken = JSON.parse(getToken);
  
        const fetchApi = await axios.get(qrcode, {
          headers: { Authorization: myToken.token },
        });
  
        if (fetchApi.data.status === 200) {
          await setqrrestaurantsData(fetchApi.data.data.restaurant);
          await setqrdiningData(fetchApi.data.data.dining_table);
          await setqrroomsData(fetchApi.data.data.rooms);
        } else {
          Swal.fire({
            title: "ohh no!",
            text: 'something going wrong',
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

  const openQrcode = (a, b, c) => {
    var ss = {
      id: a,
      qr: b,
      name: c,
      status: true,
    };
    setshowQR(ss);
  };

  return (
    <>
      <div
        className="col-sm mr-5 d-flex justify-content-center align-items-center mt-1"
        style={{
          border: "2px solid ghostwhite",
          maxWidth: "650px",
        }}
      >
        <div className="text-center">
          <img src={qrrestaurant} alt="qrcode" width="300px" height="300px" />
          <br />
          <a href={qrrestaurant} download>
            <button className="btn btn-outline-secondary btn-sm mb-2" style={{borderRadius:"10px"}}>
              Download
            </button>
          </a>
        </div>
      </div>
      <div className="col-sm mt-1" style={{ border: "2px solid ghostwhite" }}>
        {qrdining.length > 0 ? <p className="pt-3">Dining table</p> : ""}
        <div className="row g-3 pt-2">
          {qrdining.length
            ? qrdining.map((data) => {
                return (
                  <div className="col-3 col-lg-2 text-center">
                    <div
                      onClick={() =>
                        openQrcode(
                          data.dining_table,
                          data.dining_table_qrcode,
                          "Table No :"
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={data.dining_table_qrcode}
                        alt="qrcode"
                        width="40px"
                      />
                      <p>{data.dining_table}</p>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
        <hr />
        {qrrooms.length > 0 ? <p>Hotel Rooms</p> : ""}
        <div className="row g-3 pt-2">
          {qrrooms.length
            ? qrrooms.map((data) => {
                return (
                  <div className="col-3 col-lg-2 text-center">
                    <div
                      onClick={() =>
                        openQrcode(
                          data.room_number,
                          data.room_qrcode,
                          "Room No :"
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img src={data.room_qrcode} alt="qrcode" width="40px" />
                      <p className="text-center">{data.room_number}</p>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      <div className={`${showQR.status ? "model-popup" : "none"}`}>
        <div className="model-wrap">
          <div className="model-body">
            <div className="model-content">
              <div className="input_popup">
                <div className="text-center">
                  <h3>
                    {showQR.name} {showQR.id}
                  </h3>
                  <img src={showQR.qr} alt={showQR.id} />
                  <br />
                  <a href={showQR.qr} download>
                    <button className="btn btn-outline-secondary btn-sm mb-2" style={{borderRadius:"10px"}}>
                      Download
                    </button>
                  </a>
                </div>
                <button
                  className="clos-btn"
                  onClick={() => setshowQR({ id: 0, qr: "", status: false })}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QR;
