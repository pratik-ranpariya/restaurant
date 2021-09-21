import React, { useEffect } from "react";
import { useState } from "react";
import { useGlobalContext } from "../../../context.js";
import axios from "axios";

const AboutRestaurant = () => {
  const { data } = useGlobalContext();

  return (
    <>
      <div className="row mb-3 mt-4">
        <h4
          className="col-sm font-weight-bolder m-0"
          style={{ color: "#ea7a9a" }}
        >
          About Restaurant
        </h4>
      </div>
      <div>
        <p style={{ lineHeight: "1.7rem" }}>
          <strong>
            {data.about}
            {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Repellendus officia cum alias illo nam delectus recusandae. Iusto,
            non! Placeat esse aspernatur repudiandae necessitatibus hic beatae
            repellat natus facere labore quod? Sit, dolores praesentium,
            temporibus fuga modi repudiandae ipsam magni laborum illum
            inventore, aliquam maiores voluptatum excepturi blanditiis!
            Reiciendis, debitis rerum. */}
          </strong>
        </p>
      </div>
      <div className="row mt-4 mb-3">
        <h4
          className="col-sm font-weight-bolder m-0"
          style={{ color: "#ea7a9a" }}
        >
          Personal Information
        </h4>
      </div>
      <div style={{ lineHeight: "1.7rem" }}>
        <div className="row">
          <div className="col">
            <strong className="text-dark">Restaurant Name</strong>
          </div>
          <div className="col-9" style={{ fontWeight: "600" }}>
            : &nbsp; {data.name}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <strong className="text-dark">Email</strong>
          </div>
          <div className="col-9" style={{ fontWeight: "600" }}>
            : &nbsp; {data.email}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <strong className="text-dark">Username</strong>
          </div>
          <div className="col-9" style={{ fontWeight: "600" }}>
            : &nbsp; {data.username}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <strong className="text-dark">Phone Number</strong>
          </div>
          <div className="col-9" style={{ fontWeight: "600" }}>
            : &nbsp; {data.mobile}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <strong className="text-dark">Address</strong>
          </div>
          <div className="col-9" style={{ fontWeight: "600" }}>
            : &nbsp; {data.address}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <strong className="text-dark">Type</strong>
          </div>
          <div className="col-9" style={{ fontWeight: "600" }}>
            : &nbsp; {data.type}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <strong className="text-dark">Table QR Code</strong>
          </div>
          <div className="col-9" style={{ fontWeight: "600" }}>
            : &nbsp; {data.table}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <strong className="text-dark">Room QR Code</strong>
          </div>
          <div className="col-9" style={{ fontWeight: "600" }}>
            : &nbsp; {data.room}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutRestaurant;
