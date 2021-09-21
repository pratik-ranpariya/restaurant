import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase/app";
import { useFirestoreQuery, useAuthState } from "./hooks";
import { formatRelative } from "date-fns";
import "firebase/auth";
import "firebase/firestore";
// import './indexs.css'
import axios from "axios";
import { useGlobalContext } from "../../../context.js";
import "./bootstrapchat.css";
import { useForm } from "react-hook-form";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import Swal from "sweetalert2";
import _ from "lodash"

const Channel = () => {
  const { restaurant_status_table, baseUrl, chatFileUpload } =
    useGlobalContext();
  const [tableData, setTableData] = useState([]);
  const [Chat, setactiveChat] = useState({});
  const [filetype, setfiletype] = useState("file");

  const activechat = JSON.parse(localStorage.getItem("activechat"));
  useEffect(() => {
    setactiveChat(activechat ? activechat : {});
  }, []);

  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef();
  const bottomListRef = useRef();

  if (bottomListRef.current) {
    bottomListRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }

  // console.log(messages);
  const formatDate = (date) => {
    let formattedDate = "";
    if (date) {
      formattedDate = formatRelative(date, new Date());
      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  }

  const localdata = JSON.parse(localStorage.getItem("user"));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldFocusError: true });

  useEffect(() => {
    allresto();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef])

  const activeChat = (data) => {
    localStorage.setItem("activechat", JSON.stringify(data));
    window.location.reload(true);
  };

  const OnSubmit = async (data, e) => {
    var c = Math.random().toString(36).substr(2, 10);

    if (data.files.length > 0) {
      const coverdata = new FormData();
      coverdata.append("chatImage", data.files[0]);

      const result = await axios(chatFileUpload, {
        headers: { Authorization: localdata.token },
        method: "POST",
        data: coverdata,
      });

      if (result.data.status === 200) {
        messagesRef.add({
          id: c,
          text: "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          user1:
            activechat.firebase_id !== null ||
            activechat.firebase_id !== undefined
              ? activechat.firebase_id
              : "", //restaurant firebase_id
          user2: "admin",
          sender: "admin",
          sendername: "admin",
          receivername: "restaurant name",
          media: result.data.data.trim(),
          seen: "0",
        });
        setNewMessage("");

        if (bottomListRef.current) {
          bottomListRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      } else {
        Swal.fire({
          title: "Ohh no!",
          text: result.data.msg,
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } else {
      const trimmedMessage = data.text.trim();
      if (trimmedMessage) {
        messagesRef.add({
          text: trimmedMessage,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          user1:
            activechat.firebase_id !== null ||
            activechat.firebase_id !== undefined
              ? activechat.firebase_id
              : "", //restaurant firebase_id
          user2: "admin",
          sender: "admin",
          sendername: "admin",
          receivername: "restaurant name",
          media: "",
          id: c,
          seen: "0",
        });
        setNewMessage("");
        if (bottomListRef.current) {
          bottomListRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
        e.target.reset();
      }
    }
  }

  const db = firebase.firestore();
  const messagesRef = db.collection("messages");
  const messages = useFirestoreQuery(
    messagesRef
      .orderBy("user1")
      .startAt(
        activechat === null || typeof activechat === "undefined"
          ? ""
          : activechat.firebase_id
      )
      .endAt(
        activechat === null || typeof activechat === "undefined"
          ? ""
          : activechat.firebase_id
      )
  );

  const messagess = useFirestoreQuery(
    messagesRef.orderBy("user2").startAt("admin").endAt("admin")
  )

  var unseenList = [], unsin = 0;
  for (let i = 0; i < messagess.length; i++) {
    const element = messagess[i];
    if (element.seen === "0" && element.sender !== "admin") {
      unsin += 1
      unseenList.push({firebase_id: element.user1, count: 1})
    }
  }

  

  const unseenCount = (data) => {
    const res = {};
    data.forEach((obj) => {
      const key = `${obj.firebase_id}${obj["firebase_id"]}`;
      if (!res[key]) {
        res[key] = { ...obj, count: 0 };
      };
      res[key].count += 1;
    });
    const unseenData = Object.values(res);
    var gg = _.map(tableData, function (item) {
      return _.assign(item, _.find(unseenData, ['firebase_id', item.firebase_id]));
    })
    for (let i = 0; i < gg.length; i++) {
      var element = gg[i];
      if(typeof gg[i].count === 'undefined'){
        element.count = 0
      }
    }
    return gg.sort(function (a, b) { return b.count - a.count })
  }

  const setUnSeen = unseenCount(unseenList)
  if(setUnSeen){
    // setTableData(setUnSeen)
    console.log(setUnSeen);
  }

  useEffect(() => {
    (async () => {
      await unseenCount(unseenList)
      await setTableData(setUnSeen)
    })()
  }, [unsin])
  

  const makeFileType = async () => {
    setfiletype("file");
  };

  const allresto = async () => {
    try {
      const result = await axios(restaurant_status_table, {
        headers: { Authorization: localdata.token },
      });
      if (result.status === 200) {
        // console.log(ddd)
        // console.log(result.data.data);
        setTableData(result.data.data);
      } else {
        Swal.fire({
          title: "Ohh no!",
          text: 'something get wrong',
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
  }

  const { isSidebarOpen, Add_SubAdmin, in_firebase_id } = useGlobalContext();

  return (
    <>
      {activechat === null || typeof activechat === "undefined" ? (
        "please wait"
      ) : (
        <div
          id="frame"
          className={`${isSidebarOpen ? "shrink2 " : " "} `}
        >
          <div id="sidepanel" style={{ width: isSidebarOpen ? "58px" : "" }}>
            <div id="contacts">
              <ul>
                {tableData.map((resto) => {
                  return (
                    <>
                      <li
                        class={
                          activechat.firebase_id === resto.firebase_id
                            ? "contact active"
                            : "contact"
                        }

                        style={{ padding : isSidebarOpen ? " 6px 0 46px 8px" : ""}}
                        onClick={() => activeChat(resto)}
                      >
                        <div class="wrap"  style={{width: isSidebarOpen ? "100%" : ""}}>
                          {
                            resto.count > 0 ?
                            activechat.firebase_id !== resto.firebase_id ?
                          <span class="contact-status online">{resto.count}</span> 
                          : ""
                          : ""
                          }
                          <img
                            src={
                              resto.restaurent_logo
                                ? resto.restaurent_logo
                                : "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png"
                            }
                            alt=""
                            height="40px"
                          />
                          <div class="meta">
                            <p class="name" style={{ display : isSidebarOpen ? "none" : ""}}>{resto.name} ({resto.address})</p>
                          </div>
                        </div>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
          </div>
          <div
            class="content"
            style={{
              width: isSidebarOpen ? "calc(100% - 58px)" : "",
            }}
          >
            <div class="contact-profile">
              <img
                src={
                  activechat.restaurent_logo
                    ? activechat.restaurent_logo
                    : "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png"
                }
                alt=""
              />
              <p>{activechat.name} ({activechat.address}) </p>
            </div>
            <div
              class="messages"
              style={{ height: "calc(100vh - 298px) !important" }}
            >
              <ul
                className="overflow-auto"
                style={{
                  marginBottom: "150px",
                }}
              >
                {messages
                  ?.sort((first, second) =>
                    first?.createdAt?.seconds <= second?.createdAt?.seconds
                      ? -1
                      : 1
                  )
                  ?.map((messages, i) => {
                    if (messages.id) {
                      // console.log(messages, activechat.firebase_id);
                      if (messages.sender !== "admin") {
                        if(activechat.firebase_id === messages.user1){
                          if (messages.seen === "0") {
                            messagesRef.doc(messages.id).update({ seen: "1" });
                          }
                        }
                      }
                    }
                    return (
                      <>
                        <li
                          className={
                            messages.sender === "admin" ? "replies" : "sent"
                          }
                          
                        >
                          {messages.media ? (
                            <a href={messages.media} target="_blank">
                              {messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "jpeg" ||
                              messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "png" ||
                              messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "jpg" ||
                              messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "JPEG" ||
                              messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "PNG" ||
                              messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "JPG" ||
                              messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "gif" ||
                              messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "webp" ||
                              messages.media.split(".")[
                                messages.media.split(".").length - 1
                              ] === "svg" ? (
                                <img
                                  src={messages.media}
                                  alt=""
                                  width={450}
                                  style={{ width: "200px", borderRadius: 0 }}
                                />
                              ) : (
                                <>
                                  <HiOutlineDocumentDownload
                                    size="2.5em"
                                    color="rgb(234, 122, 154)"
                                    style={{
                                      float:
                                        messages.sender === "admin"
                                          ? "right"
                                          : "",
                                    }}
                                  />
                                  {messages.sender === "admin" ? <br /> : ""}
                                  <span
                                    style={{
                                      float:
                                        messages.sender === "admin"
                                          ? "right"
                                          : "",
                                      color: "rgb(234, 122, 154)",
                                    }}
                                  >
                                    {
                                      messages.media.split("/")[
                                        messages.media.split("/").length - 1
                                      ]
                                    }
                                  </span>
                                </>
                              )}
                            </a>
                          ) : (
                            <p
                              id={
                                messages.length === i + 1
                                  ? "bottomPosition"
                                  : ""
                              }
                              className={
                                messages.length === i + 1
                                  ? "mb-1 font-bold"
                                  : "mb-1 font-bold"
                              }
                              style={
                                messages.sender !== "admin"
                                  ? {
                                      backgroundColor: "#c2c7d8",
                                      color: "black",
                                      padding: "10px",
                                      borderRadius: "10px",
                                    }
                                  : {
                                      backgroundColor: "rgb(234, 122, 154)",
                                      color: "white",
                                      padding: "10px",
                                      borderRadius: "10px",
                                    }
                              }
                            >
                              {messages.text}
                            </p>
                          )}
                          <div className="items-center mb-1">
                            {messages.createdAt?.seconds ? (
                              <span
                                className={
                                  messages.sender === "admin"
                                    ? "text-gray-500 text-xs mr-2 float-right mb-1"
                                    : "text-gray-500 text-xs "
                                }
                                style={
                                  messages.sender === "admin"
                                    ? { width: "100%", textAlign: "end" }
                                    : {
                                        width: "100%",
                                        textAlign: "start",
                                        float: "left",
                                      }
                                }
                              >
                                {formatDate(
                                  new Date(messages.createdAt.seconds * 1000)
                                )}
                              </span>
                            ) : null}
                          </div>
                          <div className="clear-both"></div>
                        </li>
                      </>
                    );
                  })}
              </ul>
              <div ref={bottomListRef} />
            </div>
            <div className="d-inline-block" style={{ height: "400px" }}>
              <div class="message-input" style={{ backgroundColor: "white" }}>
                <form onSubmit={handleSubmit(OnSubmit)}>
                  <div class="wrap">
                    <label
                      for="theText"
                      className="mb-1 font-bold"
                      style={{ marginLeft: "1.5%" }}
                    >
                      <strong> Ask a question or send a message </strong>
                    </label>
                    <textarea
                      name="theText"
                      id="theText"
                      rows="5"
                      style={{
                        padding: "5px",
                        width: "97%",
                        border: "1px solid grey",
                        marginLeft: "1.5%",
                      }}
                      {...register("text")}
                    />
                    <div
                      className="d-flex align-items-center float-right"
                      style={{ marginRight: "1.5%" }}
                    >
                      <label for="file-input" className="m-0 mx-2">
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          class=""
                        >
                          <path
                            fill="currentColor"
                            d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
                          ></path>
                        </svg>
                        {/* <BsCardImage size="1.5em" className="mx-2"/> */}
                      </label>
                      <input
                        type="file"
                        name="files"
                        // accept="video/*"
                        style={{ display: "none" }}
                        id="file-input"
                        {...register("files")}
                      />
                      <button
                        type="submit"
                        className="uppercase font-semibold text-sm tracking-wider text-white p-2 px-4 float-right"
                        style={{
                          backgroundColor: "rgb(234, 122, 154)",
                          borderRadius: "10px",
                          border: "none",
                          width: "100%",
                        }}
                      >
                        SEND
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Channel;
