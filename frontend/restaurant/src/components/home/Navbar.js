import React, { useState, useEffect } from "react";
import { CgMenuRight } from "react-icons/cg";
import { MdNotificationsNone } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { AppContext, useGlobalContext } from "../../context.js";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import { useFirestoreQuery, useAuthState } from "../chat/hooks";
import "firebase/auth";
import "firebase/firestore";
import axios from 'axios'
import { RiErrorWarningFill } from "react-icons/ri"

const Navbar = () => {
  const { restaurantStatus, openSidebar, isSidebarOpen, size, Title, data } = useGlobalContext();

  const localdata = JSON.parse(localStorage.getItem("user"));
const [topNavSmall, setTopNavSmall] = useState(false)
  const db = firebase.firestore()
  const messagesRef = db.collection("messages")
  const messages = useFirestoreQuery(
    messagesRef
      .orderBy("user1")
      .startAt(localdata.firebase_id)
      .endAt(localdata.firebase_id)
  )

    var unseen = 0
    for (let i = 0; i < messages.length; i++) {
      const element = messages[i];
      if (element.seen === '0' && element.sender === "admin") {
        unseen += 1
      }
    }
	  useEffect(() => {
    getNavSmall()
  })

  const getNavSmall = async () => {
    try {
      const getToken = localStorage.getItem("user");
      if(getToken){
       var myToken = JSON.parse(getToken);

      const fetchApi = await axios.get(restaurantStatus, {
        headers: { Authorization: myToken.token },
      });

      if (fetchApi.data.status === 200) {
        if (fetchApi.data.data.status === "renue") {
          setTopNavSmall(true)
        }
      }
     }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
     <>
    {
      topNavSmall ? 
      <div class="row justify-content-center d-flex align-items-center" height="15px"style={
        size < 750 ? { textAlign: 'center',background: 'orange',height:  '55px', paddingLeft:'25px', paddingRight:'25px', color: '#fff'} 
        : 
        {background: 'orange',height:  '30px', padding:'5px', color: '#fff'}} ><b><RiErrorWarningFill size={21}/> Looks like your Subcription will ended in few days. Please Renew Your Subcription!</b></div>
      : ""
    }
    <div style={Title === 'Send a Message' ? {position: 'fixed', top: '0', width: '100%'} : {}}>
      <div
        className={`${
          isSidebarOpen
            ? "shrink d-flex py-3 justify-content-between"
            : "my_container d-flex  py-3 justify-content-between"
        } `}
      >
        <div className="d-flex align-items-center">
          <button
            className={`${isSidebarOpen ? "none" : "sidebar-toggle"}`}
            onClick={openSidebar}
          >
            <CgMenuRight />
          </button>
          {/* <h3 className="p-0 ml-2 m-0"><strong>{`${dashboard? "Dashboard" : order? "order": update? "update details" :"dashboard"}`}</strong></h3> */}
          <h3 className="p-0 ml-2 m-0">
            <strong>{Title}</strong>
          </h3>
        </div>
        <div className="d-flex">
          <div className="d-flex align-items-center justify-content-center flex-wrap">
	  {/*  <button
              className="my_btn "
              style={{
                border: 0,
                backgroundColor: "rgb(242, 237, 234)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
              }}
              type="submit"
            >
              <MdNotificationsNone size={20} style={{ color: "green" }} />
              <div className="notification">12</div>
            </button>*/}

	    <Link to="/chat">
              <button
                className="my_btn "
                style={{
                  border: 0,
                  backgroundColor: "rgb(242, 237, 234)",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  marginLeft: "4px",
                }}
                type="submit"
              >
                <BiMessageDetail size={20} style={{ color: "green" }} />

              {unseen ? <div className="notification">{unseen}</div> : ''}
	  </button>
            </Link>
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <div className="d-flex ml-1 align-items-center ">
                <img
                  src={data.restaurent_logo ? data.restaurent_logo : 'https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png'}
                  alt=""
                  style={{
                    border: 0,
                    // backgroundColor: "rgb(242, 237, 234)",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                  }}
                />
                {/* <div className="ml-1 text-center"> */}
                <div
                  className={`${size <= 650 ? "none" : "mx-1"}`}
                  style={{ color: "black" }}
                >
                  <h4 className="mb-0">
                    <strong>{data.name}</strong>
                  </h4>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
   </>
  );
};

export default Navbar;
