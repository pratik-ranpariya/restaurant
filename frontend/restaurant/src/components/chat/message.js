import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import { useFirestoreQuery, useAuthState } from "./hooks";
import { formatRelative } from "date-fns";
import "firebase/auth";
import "firebase/firestore";
import "./indexs.css";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Channel = ({ user = null }) => {
  //const { isSidebarOpen } = useGlobalContext();
  const localdata = JSON.parse(localStorage.getItem("user"));
  const [msglengrh, setMsgLength] = useState(0)

  const db = firebase.firestore();
  const messagesRef = db.collection("messages");
  const messages = useFirestoreQuery(
    messagesRef
      .orderBy("user1")
      .startAt(localdata.firebase_id)
      .endAt(localdata.firebase_id)
  );

  const inputRef = useRef();
  const bottomListRef = useRef();
  const { isSidebarOpen, restaurant_status_table, baseUrl, chatFileUpload } =
    useGlobalContext();

  const formatDate = (date) => {
    let formattedDate = "";
    if (date) {
      formattedDate = formatRelative(date, new Date());
      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setTimeout(() => {
      window.scrollTo(0, 1000000000000000);
    }, 1000);
  }, [inputRef]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldFocusError: true });

  const handleOnSubmit = async (data, e) => {
    try {
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
          messagesRef.doc(c).set({
            text: "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user1: localdata.firebase_id,
            user2: "admin",
            sender: localdata.firebase_id,
            sendername: localdata.username ? localdata.username : "",
            receivername: "admin",
            seen: "0",
            id: c,
            media: result.data.data.trim(),
          });
          setTimeout(() => {
            window.scrollTo(0, 1000000000000000);
          }, 100);
        } else {
          Swal.fire({
            title: "ohh no!",
            text: 'something going wrong',
            icon: "error",
            confirmButtonColor: 'rgb(234, 122, 154)'
          })
        }
      } else {
        const trimmedMessage = data.text.trim();
        if (trimmedMessage) {
          messagesRef.doc(c).set({
            id: c,
            text: trimmedMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user1: localdata.firebase_id,
            user2: "admin",
            sender: localdata.firebase_id,
            sendername: localdata.username ? localdata.username : "",
            receivername: "admin",
            seen: "0",
            media: "",
          });
          setTimeout(() => {
            window.scrollTo(0, 1000000000000000);
          }, 100);
          e.target.reset();
        }
      }

    } catch (e) {
      Swal.fire({
        title: "ohh no!",
        text: e.msg,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };

  return (

    <div className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}>
      <div className="flex flex-col">
        <div>
          <div className="py-2" style={{marginTop: "72px"}}>
            {/* <h5 className="font-bold" style={{marginLeft: "10px"}}>Send A Message</h5> */}
            <ul
              className="overflow-auto"
            >
              {messages
                ?.sort((first, second) =>
                  first?.createdAt?.seconds <= second?.createdAt?.seconds
                    ? -1
                    : 1
                )
                ?.map((message, i) => {
                  if (message.id) {
                    if (message.sender === "admin") {
                      if (message.seen === "0") {
                        messagesRef.doc(message.id).update({ seen: "1" });
                      }
                    }
                  }
                    
                    
                  return (
                    <>
                      <li
                        key={message.id}
                        className={
                          message.sender === "admin"
                            ? "float-left"
                            : "float-right"
                        }
                      >
                        <div className="px-4 py-4 rounded-md hover:bg-gray-50 dark:hover:bg-coolDark-600 overflow-hidden flex items-start">
                          <div>
                            {message.media ? (
                              <a href={message.media} target="_blank">
                                {
                                (message.media.split('.')[message.media.split('.').length - 1] === 'jpeg' || 
                                message.media.split('.')[message.media.split('.').length - 1] === 'png' ||
                                message.media.split('.')[message.media.split('.').length - 1] === 'jpg' ||
                                message.media.split('.')[message.media.split('.').length - 1] === 'JPEG' || 
                                message.media.split('.')[message.media.split('.').length - 1] === 'PNG' ||
                                message.media.split('.')[message.media.split('.').length - 1] === 'JPG' ||
                                message.media.split('.')[message.media.split('.').length - 1] === 'gif' ||
                                message.media.split('.')[message.media.split('.').length - 1] === 'webp' ||
                                message.media.split('.')[message.media.split('.').length - 1] === 'svg') ? 

                                <img
                                  src={message.media}
                                  alt=""
                                  width={450}
                                  style={{ width: "200px", borderRadius: 0 }}
                                /> : 
                                <>
                                <HiOutlineDocumentDownload size="2.5em" color="rgb(234, 122, 154)" style={{float: message.sender !== "admin" ? 'right' : ''}} />
                                <br />
                                <span style={{float: message.sender !== "admin" ? 'right' : '', color: 'rgb(234, 122, 154)'}}>{message.media.split('/')[message.media.split('/').length - 1]}</span>
                                </>
                                }


                              </a>
                            ) : (
                              <p
                                className={
                                  messages.length === i + 1
                                    ? "mb-1 font-bold bottomPosition"
                                    : "mb-1 font-bold"
                                }
                                style={
                                  message.sender === "admin"
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
                                {message.text}
                              </p>
                            )}
                            <div className="items-center mb-1">
                              {message.createdAt?.seconds ? (
                                <span
                                  className={
                                    message.sender === "admin"
                                      ? "text-gray-500 text-xs"
                                      : "text-gray-500 text-xs mr-2 float-right mb-1"
                                  }
                                >
                                  {formatDate(
                                    new Date(message.createdAt.seconds * 1000)
                                  )}
                                </span>
                              ) : null}

                            </div>
                            <div className="clear-both"></div>
                          </div>
                        </div>
                      </li>
                      <li className="clear-both"></li>

                    </>
                  );
                })}

            </ul>
          </div>
        </div>
      </div>
              <div style={{
                    position: "sticky",
                    bottom: "0px",
                    width: "100%",
                    height: "150px",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    marginLeft: '5px'
                  }}>
                <form
                  id="message_sent_form"
                  onSubmit={handleSubmit(handleOnSubmit)}
                  className="flex-row"
                >
                  <label for="theText" className="mb-1 font-bold">
                    Ask a question or send a message
                  </label>

                  <textarea
                    name="theText"
                    id="theText"
                    rows="5"
                    style={{ padding: '5px', width: "100%", border: '1px solid gray' }}
                    {...register("text")}
                  ></textarea>
                  <div className="d-flex align-items-center float-right">
                    <label for="file-input" className="m-0 mx-2">
                      <svg viewBox="0 0 24 24" width="24" height="24" class="">
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
                      }}>
                      SEND
                    </button>
                  </div>
                </form>
              </div>
    </div>
  );
};

export default Channel;                                                                                                                                                                                                                                                                                                                                              
