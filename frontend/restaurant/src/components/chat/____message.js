import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import { useFirestoreQuery, useAuthState } from "./hooks";
import { formatRelative } from "date-fns";
import "firebase/auth";
import "firebase/firestore";
import "./indexs.css";
import { BsFillCursorFill } from "react-icons/bs";
import { useGlobalContext } from "../../context";
import axios from "axios";
import { useForm } from "react-hook-form";

const Channel = ({ user = null }) => {
  const { isSidebarOpen } = useGlobalContext();
  const localdata = JSON.parse(localStorage.getItem("user"));

  console.log(localdata);

  const db = firebase.firestore();
  const messagesRef = db.collection("messages");
  const messages = useFirestoreQuery(
    messagesRef
      .orderBy("user1")
      .startAt(localdata.firebase_id)
      .endAt(localdata.firebase_id)
  );
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef();
  const bottomListRef = useRef();
  const { restaurant_status_table, baseUrl, chatFileUpload } =
    useGlobalContext();

  console.log(localdata.firebase_id);
  const formatDate = (date) => {
    let formattedDate = "";
    if (date) {
      // Convert the date in words relative to the current date
      formattedDate = formatRelative(date, new Date());
      // Uppercase the first letter
      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldFocusError: true });

  const handleOnSubmit = async (data, e) => {
    try {
      if (data.files.length > 0) {
        const coverdata = new FormData();
        coverdata.append("chatImage", data.files[0]);

        const result = await axios(chatFileUpload, {
          headers: { Authorization: localdata.token },
          method: "POST",
          data: coverdata,
        });

        console.log(result.data);
        if (result.data.status === 200) {
          messagesRef.add({
            text: "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user1: localdata.firebase_id,
            user2: "admin",
            // displayName,
            sender: localdata.firebase_id,
            sendername: localdata.username ? localdata.username : "",
            receivername: "admin",
            // photoURL: photoURL ? photoURL : '',
            media: result.data.data.trim(),
          });
          setNewMessage("");

          bottomListRef.current.scrollIntoView({ behavior: "smooth" });
        } else {
          alert(result.data.msg);
        }
      } else {
        const trimmedMessage = data.text.trim();
        if (trimmedMessage) {
          messagesRef.add({
            text: trimmedMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user1: localdata.firebase_id,
            user2: "admin",
            // displayName,
            sender: localdata.firebase_id,
            sendername: localdata.username ? localdata.username : "",
            receivername: "admin",
            // photoURL: photoURL ? photoURL : '',
            media: "",
          });
          setNewMessage("");

          bottomListRef.current.scrollIntoView({ behavior: "smooth" });
          e.target.reset();
        }
      }
    } catch (e) {
      alert(e.messages);
    }
  };

  return (
    <div className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4 "} `}>
      <div className="flex flex-col">
        <div>
          <div className="py-2" style={{ marginTop: "53px" }}>
            <h5 className="font-bold">Send A Message</h5>

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
                ?.map((messages) => {
                  return (
                    <>
                      <li
                        key={messages.id}
                        className={
                          messages.sender === "admin"
                            ? "float-left"
                            : "float-right"
                        }
                      >
                        <div className="px-4 py-4 rounded-md hover:bg-gray-50 dark:hover:bg-coolDark-600 overflow-hidden flex items-start">
                          <div>
                            {messages.media ? (
                              <a href={messages.media} target="_blank">
                                <img
                                  src={messages.media}
                                  alt=""
                                  width={450}
                                  style={{ width: "200px", borderRadius: 0 }}
                                />
                              </a>
                            ) : (
                              <p
                                className="mb-1 font-bold"
                                style={
                                  messages.sender === "admin"
                                    ? {
                                        backgroundColor: "#c2c7d8",
                                        color: "black",
                                        padding: "10px",
                                        borderRadius: "5px",
                                      }
                                    : {
                                        backgroundColor: "rgb(234, 122, 154)",
                                        color: "white",
                                        padding: "10px",
                                        borderRadius: "5px",
                                      }
                                }
                                // style={{
                                //   backgroundColor: "rgb(234, 122, 154)",
                                //   color: "white",
                                //   padding: "10px",
                                //   borderRadius: "5px",
                                // }}
                              >
                                {messages.text}
                              </p>
                            )}
                            <div className="items-center mb-1">
                              {/* {messages.sender ? (
                              <p
                                className={
                                  messages.sender === "admin"
                                    ? "mr-2 mb-0 text-green-500"
                                    : "mr-2 mb-0 text-primary-500 text-right"
                                }
                              >
                                {messages.sender === "admin"
                                  ? messages.sender
                                  : messages.sendername}
                              </p>
                            ) : null} */}
                              {messages.createdAt?.seconds ? (
                                <span
                                  className={
                                    messages.sender === "admin"
                                      ? "text-gray-500 text-xs"
                                      : "text-gray-500 text-xs mr-2 float-right mb-1"
                                  }
                                >
                                  {formatDate(
                                    new Date(messages.createdAt.seconds * 1000)
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

            <div ref={bottomListRef} />
          </div>
        </div>
      </div>
      <div style={{ clear: "both" }}></div>
      <div  style={{
            // position: "fixed",
            position:"sticky",
            bottom: "0",
            width: "100%",
            height: "150px",
            backgroundColor: "white",
            borderRadius: "4px"
          }}>
        <form
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
            style={{ width: "100%", border: "1px solid grey", padding: "5px" }}
            {...register("text")}
          ></textarea>
          <div className="d-flex align-items-center float-right">
            <input
              type="file"
              name="files"
              accept="image/*"
              style={{ display: "none" }}
              id="file-input"
              {...register("files")}
            />
            <button
              type="submit"
              className="uppercase font-semibold text-sm tracking-wider text-white p-2 px-4 float-right"
              style={{
                backgroundColor: "rgb(234, 122, 154)",
                borderRadius: "5px",
                border: "none",
              }}
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Channel;
