import React from "react";
import { MdNotificationsNone } from "react-icons/md";
import { CgMenuRight } from "react-icons/cg";
import { BiMessageDetail } from "react-icons/bi";
import { useGlobalContext } from "../../context.js";
import { NavLink } from "react-router-dom";
import firebase from "firebase/app";
import { useFirestoreQuery, useAuthState } from "../superAdmin/chat/hooks";
import "firebase/auth";
import "firebase/firestore";

const Navbar = () => {
  const { openSidebar, isSidebarOpen, Title, size } = useGlobalContext();
  const localdata = JSON.parse(localStorage.getItem("user"));

  const db = firebase.firestore();
  const messagesRef = db.collection("messages");
  const messages = useFirestoreQuery(
    messagesRef.orderBy("user2").startAt("admin").endAt("admin")
  );

  var unseen = 0;
  for (let i = 0; i < messages.length; i++) {
    const element = messages[i];
    if (element.seen === "0" && element.sender !== "admin") {
      unseen += 1;
    }
  }

  return (
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
        <h3 className="p-0 ml-2 m-0">
          <strong>{Title}</strong>
        </h3>
      </div>
      <div className="d-flex">
        <div className="d-flex align-items-center justify-content-center flex-wrap">
	  {/* <button
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
          </button> */}
          <NavLink to="/chat">
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
              {unseen ? <div className="notification">{unseen}</div> : ""}
            </button>
          </NavLink>
          <div className="d-flex ml-1 align-items-center ">
            <label
              for="profilePic"
              className="myProfilePicLabel m-0 mx-2"
              style={{
                cursor: "pointer",
                border: 0,
                width: "40px",
                height: "40px",
                position:"relative",
                width:"40px",
                height:"40px",
                // position: "absolute",
              }}
            >
              <img
                src={
                  "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883417/person-3_ipa0mj.jpg"
                }
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  verticalAlign:"top"
                }}
              />
              {/* <BsCardImage size="1.5em" className="mx-2"/> */}
            </label>
            {/* <label for="profilePic" className="hideProfilePic m-0 mx-2"
              style={{
                cursor: "pointer",
                border: 0,
                width: "40px",
                height: "40px",
                position: "relative",
              }}
            ></label> */}

            <input
              type="file"
              name="files"
              // accept="video/*"
              style={{ display: "none" }}
              id="profilePic"
            />

	  {/* <div className={`${size <= 550 ? "none" : "ml-1 text-center"}`}>
              <h4 className="mb-0">
                <strong>Admin</strong>
              </h4>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
