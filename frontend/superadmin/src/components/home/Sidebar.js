import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo.png";
import { FaTimes } from "react-icons/fa";
import { CgDatabase, CgChevronDown } from "react-icons/cg";
import { useGlobalContext } from "../../context.js";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar, smallSidebar } = useGlobalContext();

  return (
    <aside className={`${isSidebarOpen ? "sidebar show-sidebar" : "sidebar"} `}>
      <div className="sidebar-header">
        {/* <img src={Logo} className="logo" alt="logo" /> */}
        <p style={{color:"#194e95",marginBottom:"0" ,fontSize:"21px"}}>Scann<span  style={{color:"rgb(234, 122, 154)" , fontWeight:"bolder"}}>Menu</span> </p>
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
      </div>
      <div className="d-flex justify-content-center sidebar-body  my-2">
        <a href="#" onClick={smallSidebar}>
          <NavLink
            to="/Dashboard"
            activeClassName="selected"
            activeStyle={{
              fontWeight: "bold",
              color: "#ea7a9a",
            }}
          >
            <button
              className="btn-block"
              style={{
                border: 0,
                width: "200px",
                borderRadius: "10px",
                backgroundColor: "rgb(234,122,154)",
                color: "white",
                padding: "9px 0px 7px 0px",
              }}
            >
              <CgDatabase size={20} /> &nbsp; Dashboard
              <CgChevronDown size={15} style={{ marginLeft: "40px" }} />
            </button>
          </NavLink>
        </a>
      </div>
      <ul className="links mt-3">
        <NavLink
          to="/AddSubAdmin"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li className="">
            <a href="#" onClick={smallSidebar}>
              <h6>
                <small>Add Restaurant</small>
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/RestaurantDetails"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#" onClick={smallSidebar}>
              <h6>
                <small>View Restaurant Details</small>
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/ManageSubscription"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#" onClick={smallSidebar}>
              <h6>
                {" "}
                <small>Manage Subscription</small>{" "}
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/AddSubscription"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#" onClick={smallSidebar}>
              <h6>
                {" "}
                <small>Add Subscription</small>{" "}
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/Status"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#" onClick={smallSidebar}>
              <h6>
                {" "}
                <small>Status</small>{" "}
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/AutoReneue"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#" onClick={smallSidebar}>
              <h6>
                {" "}
                <small>Auto Reneue</small>{" "}
              </h6>
            </a>
          </li>
        </NavLink>
        {/* <li>
          <a href="#" onClick={smallSidebar}>
            <h6>
              <NavLink
                to="/Restaurant"
                activeClassName="selected"
                activeStyle={{
                  fontWeight: "bold",
                  color: "#ea7a9a",
                }}
              >
                {" "}
                <small>Restaurant</small>{" "}
              </NavLink>
            </h6>
          </a>
        </li> */}
        <li>
          <a href="#">
            <h6>
              <Link to="/logout">
                {" "}
                <small>Logout</small>{" "}
              </Link>
            </h6>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
