import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo.png";
import { FaTimes } from "react-icons/fa";
import { CgDatabase, CgChevronDown } from "react-icons/cg";
import { useGlobalContext } from "../../context.js";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar, smallSidebar, todaydata } =
    useGlobalContext();

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
          <Link to="/Dashboard">
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
              onClick={todaydata}
            >
              <CgDatabase size={20} /> &nbsp; Dashboard
              <CgChevronDown size={15} style={{ marginLeft: "40px" }} />
            </button>
          </Link>
        </a>
      </div>
      <ul className="links mt-3">
        <NavLink
          to="/Dashboard"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
          onClick={todaydata}
        >
          <li className="">
            <a href="#" onClick={smallSidebar}>
              <h6>
                <small>Dashboard</small>
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/Orders"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#" onClick={smallSidebar}>
              <h6>
                <small>Orders</small>
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/Update_details"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#" onClick={smallSidebar}>
              <h6>
                <small>Update Details</small>
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/subscription"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#" onClick={smallSidebar}>
              <h6>
                <small>Subscription</small>
              </h6>
            </a>
          </li>
        </NavLink>
        <NavLink
          to="/logout"
          activeClassName="selected"
          activeStyle={{
            fontWeight: "bold",
            color: "#ea7a9a",
          }}
        >
          <li>
            <a href="#">
              <h6>
                <small>Logout</small>
              </h6>
            </a>
          </li>
        </NavLink>
      </ul>
    </aside>
  );
};

export default Sidebar;
