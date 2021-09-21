import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import { useFirestoreQuery, useAuthState} from './hooks';
import { formatRelative } from 'date-fns';
import 'firebase/auth';
import 'firebase/firestore';
import './indexs.css'
// import { useAuthState, useDarkMode } from './hooks';

// import firebase
// firebase.initializeApp({
//     apiKey: "AIzaSyB9ir88TBdApxuWJJJp7TWCAVs2VVS6LYM",
//     authDomain: "scannmenu-a263c.firebaseapp.com",
//     projectId: "scannmenu-a263c",
//     storageBucket: "scannmenu-a263c.appspot.com",
//     messagingSenderId: "205176802477",
//     appId: "1:205176802477:web:2f5dfd006819d0fad20a24",
// })

const Channel = ({ user = null }) => {
    const localdata = JSON.parse(localStorage.getItem("user"));

    // console.log(localdata);

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

  const handleOnSubmit = e => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
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
      // Clear input field
      setNewMessage('');
      // Scroll down to the bottom of the list
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' })
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
                            <div className="flex items-center mb-1">
                              {messages.sender ? (
                                <p className={messages.sender === 'admin' ? 'mr-2 text-green-500' : 'mr-2 text-primary-500'}>{messages.sender === 'admin' ? messages.sender : messages.sendername}</p>
                              ) : null}
                              {messages.createdAt?.seconds ? (
                                <span className="text-gray-500 text-xs">
                                  {formatDate(new Date(messages.createdAt.seconds * 1000))}
                                </span>
                              ) : null}
                            </div>
                            {
                          messages.media ? 
                          <a href={messages.media} target="_blank"><img src={messages.media} alt="" width={450} style={{width: '200px', borderRadius: 0}}/></a>
                           :  <p>{messages.text}</p>
                          }
                            {/* <p>{messages.text}</p> */}
                          </div>
                        </div>
                      </li>
                      <li className="clear-both"></li>
                    </>
                  )
                })}
          </ul>
          <div ref={bottomListRef} />
        </div>
      </div>
      <div className="mb-6 mx-4">
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-row bg-gray-200 dark:bg-coolDark-400 rounded-md px-4 py-3 z-10 max-w-screen-lg mx-auto dark:text-white shadow-md"
        >
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleOnChange}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage}
            className="uppercase font-semibold text-sm tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// Channel.propTypes = {
//   user: PropTypes.shape({
//     firebase_id: PropTypes.string,
//     displayName: PropTypes.string,
//     photoURL: PropTypes.string,

//     // receivername: PropTypes.string,
//     // sender: PropTypes.string,
//     // sendername: PropTypes.string,
//     // user1: PropTypes.string,
//     // user2: PropTypes.string
//   }),
// };

export default Channel;
