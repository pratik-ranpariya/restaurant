import React, { useState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
import { HiMenu } from "react-icons/hi";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../context";
import Items from "./Items";

const Menu = () => {
  const { cart, total_quantity, ordereditem } = useGlobalContext();

  // const { register, handleSubmit } = useForm();

  const [restItem, setrestItem] = useState([]);
  const [click, setclick] = useState(false);
  const [Menu, setMenu] = useState(true);
  const [Selected, setSelected] = useState("");
  // const [filterData, setfilterData] = useState(cart);
  const [Type, setType] = useState("");
  const [logo, setlogo] = useState({});

  const apiLink = localStorage.getItem("api");
  console.log(apiLink)
  const callApis = async () => {
    try {
      if(apiLink !== null){
      const result = await axios(apiLink, {
        headers: {
          "Content-type": "application/json",
        },
      });
      if (result.status === 200) {
        setlogo(result.data.data);
      } else {
        alert(result.msg);
      }
     }
    } catch (e) {
      // console.log(e);
      alert(e.message);
    }
  };

  useEffect(() => {
    callApis();
    for (let i = 0; i < cart.length; i++) {
      const elem = cart[i];
      restItem.push(elem.type);
    }
    let addobject = restItem.filter((item, i, ar) => ar.indexOf(item) === i);
    var obdata = [];
    for (let i = 0; i < addobject.length; i++) {
      obdata.push({ name: addobject[i] });
    }
    setrestItem(obdata);
    onSubmits({ item: "All" });
  }, [cart]);

  const onSubmits = (data) => {
    setType(data.item);

    // if (data.item === "All") {
    //   setfilterData(cart);
    // } else {
    //   const filteredData = cart.filter((datas) => {
    //     return datas.type === data.item;
    //   });
    //   setfilterData(filteredData);
    // }
  };

  if (Type && Type !== "" && Type !== "All" && Type !== null) {
    window.scrollTo(0, document.getElementById(Type).offsetTop);
  }

  return (
    <>
      <div className="container">
        <header style={{ height: "60px" }}>
          <div
            style={{
              display: "flex",
              padding: "15px",
              alignItems: "center",
            }}
          >
            <img
              src={logo.restaurent_logo}
              alt="Logo"
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
      <div className="container px-3">
        <section style={{ paddingBottom: "20px" }}>
          <span style={{ fontWeight: "bold" }}>Menu</span>
          {/* <form onChange={handleSubmit(onSubmits)}>
            <select
              style={{
                width: "85vw",
                fontWeight: "bold",
                border: "none",
                outline: "none",
                background: "none",
                textTransform: "capitalize",
              }}
              {...register("item")}
            >
              <option value="All" style={{ fontWeight: "bold" }}>
                Main Course
              </option>
              {restItem.map((data, index) => {
                return (
                  <>
                    <option
                      key={index}
                      value={data.name}
                      style={{ fontWeight: "bold" }}
                    >
                      {data.name}
                    </option>
                  </>
                );
              })}
            </select>
          </form> */}
        </section>
      </div>

      <Items
        filterData={cart}
        setclick={setclick}
        setMenu={setMenu}
        Menu={Menu}
        setType={setType}
        click={click}
      />

      <div
        className="d-flex justify-content-end mr-1"
        style={{ position: "sticky", bottom: "50px" }}
      >
        <div class="dropup" onClick={() => setclick(!click)}>
          <button class="dropbtn" onClick={() => setMenu(!Menu)}>
            {Menu === true ? (
              <>
                <HiMenu style={{ marginTop: "-2px" }} /> Menu
              </>
            ) : (
              <h6 className="m-0" onClick={() => setclick(false)}>
                Close
              </h6>
            )}
          </button>
          <div
            className="dropup-content"
            style={{
              display: click === true ? "block" : "none",
            }}
          >
            {restItem.map((data, index) => {
              return (
                <>
                  <span
                    onClick={() => {
                      setType(data.name);
                      setclick(false);
                      setMenu(!Menu);
                      setSelected(data.name);
                    }}
                    // onMouseOver={() => setclick(false)}
                    style={{ fontWeight: data.name === Selected ? "bold" : "" }}
                  >
                    {data.name}
                  </span>
                </>
              );
            })}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center" style={{ height: "70px" }}>
        <footer
          className="p-2"
          style={{
            backgroundColor: "#f51929",
            position: "fixed",
            width: "100vw",
            bottom: 0,
          }}
        >
          <div className="container d-block">
            <div className="row">
              <div className="col-6">
                <h5 className="text-white">{total_quantity} Items</h5>
              </div>
              {total_quantity > 0 ? (
                <div className="col-6">
                  <Link
                    to={{
                      pathname: "/billdetails",
                      state: cart,
                    }}
                  >
                    <div
                      className="view_cart"
                      style={{ float: "right" }}
                      onClick={() => ordereditem()}
                    >
                      <p className="text-white">
                        View Cart <i className="bi bi-play-fill" />
                      </p>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="col-6">
                  <div className="view_cart" style={{ float: "right" }}>
                    <p className="text-white">
                      Select Item <i className="bi bi-play-fill" />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Menu;
