import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import { useFirestoreQuery, useAuthState } from './hooks';
import { formatRelative } from 'date-fns';
import 'firebase/auth';
import 'firebase/firestore';
import './indexs.css'
import { BsFillCursorFill } from 'react-icons/bs'
import { useGlobalContext } from "../../context";
import axios from "axios";
import { useForm } from "react-hook-form";

const Channel = ({ user = null }) => {
  const localdata = JSON.parse(localStorage.getItem("user"));

  console.log(localdata);

  const db = firebase.firestore();
  const messagesRef = db.collection('messages');
  const messages = useFirestoreQuery(
    messagesRef
      .orderBy('user1')
      .startAt(localdata.firebase_id)
      .endAt(localdata.firebase_id)
  )
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef();
  const bottomListRef = useRef();
  const { restaurant_status_table, baseUrl, chatFileUpload } = useGlobalContext();

  console.log(localdata.firebase_id);
  const formatDate = (date) => {
    let formattedDate = '';
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

  const handleOnChange = e => {
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
        coverdata.append("chatImage", data.files[0])
  
        const result = await axios(chatFileUpload, {
          headers: { Authorization: localdata.token },
          method: "POST",
          data: coverdata
        })
  
        console.log(result.data);
        if (result.data.status === 200) {
  
          messagesRef.add({
            text: '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user1: localdata.firebase_id,
            user2: 'admin',
            // displayName,
            sender: localdata.firebase_id,
            sendername: localdata.username ? localdata.username : '',
            receivername: 'admin',
            // photoURL: photoURL ? photoURL : '',
            media: result.data.data.trim()
          });
          setNewMessage('');
  
          bottomListRef.current.scrollIntoView({ behavior: 'smooth' })
        } else {
          alert(result.data.msg)
        }
      } else {
        const trimmedMessage = data.text.trim();
        if (trimmedMessage) {
  
          messagesRef.add({
            text: trimmedMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user1: localdata.firebase_id,
            user2: 'admin',
            // displayName,
            sender: localdata.firebase_id,
            sendername: localdata.username ? localdata.username : '',
            receivername: 'admin',
            // photoURL: photoURL ? photoURL : '',
            media: ''
          });
          setNewMessage('');
  
          bottomListRef.current.scrollIntoView({ behavior: 'smooth' })
          e.target.reset();
  
        }
      }
    } catch (e) {
      alert(e.messages) 
    }

  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto h-full">
        <div className="py-4 max-w-screen-lg mx-auto">

          <ul>
            {
              messages
                ?.sort((first, second) =>
                  first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
                )
                ?.map((messages) => {
                  return (
                    <>
                      <li key={messages.id} className={messages.sender === 'admin' ? 'float-left' : 'float-right'}>
                        {/* <Message {...message} /> */}
                        <div className="px-4 py-4 rounded-md hover:bg-gray-50 dark:hover:bg-coolDark-600 overflow-hidden flex items-start">
                          <div>
                            <div className="items-center mb-1">
                              {messages.sender ? (
                                <p className={messages.sender === 'admin' ? 'mr-2 mb-0 text-green-500' : 'mr-2 mb-0 text-primary-500 text-right'}>{messages.sender === 'admin' ? messages.sender : messages.sendername}</p>
                              ) : null}
                              {messages.createdAt?.seconds ? (
                                <span className={messages.sender === 'admin' ? "text-gray-500 text-xs" : "text-gray-500 text-xs mr-2 float-right mb-1"}>
                                  {formatDate(new Date(messages.createdAt.seconds * 1000))}
                                </span>
                              ) : null}
                            </div>
                            <div className="clear-both"></div>
                            {
                              messages.media ?
                                <a href={messages.media} target="_blank"><img src={messages.media} alt="" width={450} style={{ width: '200px', borderRadius: 0 }} /></a>
                                : <p style={{ backgroundColor: 'rgb(234, 122, 154)', color: 'white', padding: '10px', borderRadius: '15px' }}>{messages.text}</p>
                            }
                            {/* <p>{messages.text}</p> */}
                          </div>
                        </div>
                      </li>
                      <li className="clear-both"></li>
                    </>
                  )
                })}

            <div className="mb-6">
              <form
                // onSubmit={handleOnSubmit}
                onSubmit={handleSubmit(handleOnSubmit)}
                style={{ position: 'fixed', bottom: '10px', width: '100%', backgroundColor: "white", borderRadius: "10px" }}
                className="flex flex-row bg-gray-200 dark:bg-coolDark-400 px-1 py-1 z-10 max-w-screen-lg mx-auto dark:text-white shadow-md"
              >
                <input
                  // ref={inputRef}
                  type="text"
                  // value={newMessage}
                  {...register("text")}
                  // onChange={handleOnChange}
                  placeholder="Type your message here..."
                  className="flex-1 outline-none border-0"
                  style={{ borderRadius: "20px", padding: "0 10px", backgroundColor: "lightgray" }}
                />
                <div className="d-flex align-items-center">
                  <label for="file-input">
                    <svg viewBox="0 0 24 24" width="24" height="24" class=""><path fill="currentColor" d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"></path></svg>
                  </label>
                  <input type="file" name="files" accept="image/*" style={{ display: 'none', }} id="file-input"
                    {...register("files")}
                  />

                </div>
                <button
                  type="submit"
                  // disabled={!newMessage}
                  className="uppercase font-semibold text-sm tracking-wider text-white p-1 px-2"
                  style={{ backgroundColor: "rgb(140,20,54,1)", borderRadius: '15px' }}
                >
                  <BsFillCursorFill />
                </button>
              </form>
            </div>
          </ul>
          <div ref={bottomListRef} />
        </div>
      </div>

    </div>
  );
};

export default Channel;

