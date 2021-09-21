import React, { useEffect, useState, useRef } from 'react';
import firebase from 'firebase/app';
import { useFirestoreQuery, useAuthState } from './hooks';
import { formatRelative } from 'date-fns';
import 'firebase/auth';
import 'firebase/firestore';
// import './indexs.css'
import axios from "axios";
import { useGlobalContext } from "../../../context.js";
import './bootstrapchat.css';
import { useForm } from "react-hook-form";

const Channel = () => {
  
  const { restaurant_status_table, baseUrl, chatFileUpload } = useGlobalContext();
  const [tableData, setTableData] = useState([]);
  const [Chat, setactiveChat] = useState({});
  const [filetype, setfiletype] = useState('file')
  
  const activechat = JSON.parse(localStorage.getItem("activechat"))
  useEffect(()=>{
    setactiveChat(activechat ? activechat : {})
    console.log(activechat, '---------')
  },[])
  
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef();
  const bottomListRef = useRef();
  
  // console.log(messages);
  const formatDate = (date) => {
    let formattedDate = '';
    if (date) {
      formattedDate = formatRelative(date, new Date());
      formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  };
  
  const localdata = JSON.parse(localStorage.getItem("user"));
  const allresto = async () => {
    try {
      const result = await axios(restaurant_status_table, {
        headers: { Authorization: localdata.token }
      });
      if (result.status === 200) {
        setTableData(result.data.data);
      } else {
        alert('something get wrong')
      }
    } catch (e) {
      console.log(e);
      alert(e.message)
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({shouldFocusError: true});

  useEffect(() => {
    allresto()
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleOnChange = e => {
    setNewMessage(e.target.value);
  };

  const activeChat = data => {
    localStorage.setItem('activechat', JSON.stringify(data))
    window.location.reload(true);
  }

  const handleOnSubmit = async (data, e)=> {

    // e.preventDefault();
    
    console.log(data);

    if (data.files.length > 0) {
      const coverdata = new FormData();
      coverdata.append("chatImage", data.files[0])

      const result = await axios(chatFileUpload, {
        headers: { Authorization: localdata.token },
        method: "POST",
        data: coverdata
      })

      console.log(result.data);
      if(result.data.status === 200){
          
          messagesRef.add({
            text: '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user1: activechat.firebase_id !== null || activechat.firebase_id !== undefined ? activechat.firebase_id : '', //restaurant firebase_id
            user2: 'admin',
            // displayName,
            sender: 'admin',
            sendername: 'admin',
            receivername: 'restaurant name',
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
          user1: activechat.firebase_id !== null || activechat.firebase_id !== undefined ? activechat.firebase_id : '', //restaurant firebase_id
          user2: 'admin',
          // displayName,
          sender: 'admin',
          sendername: 'admin',
          receivername: 'restaurant name',
          // photoURL: photoURL ? photoURL : '',
          media: ''
        });
        setNewMessage('');
        
        bottomListRef.current.scrollIntoView({ behavior: 'smooth' })
        e.target.reset();

    
      }
    }

    
  };

  const db = firebase.firestore();
  const messagesRef = db.collection('messages');
  const messages = useFirestoreQuery(
    messagesRef
      .orderBy('user1')
      .startAt(activechat === null || typeof activechat === 'undefined' ? '' : activechat.firebase_id)
      .endAt(activechat === null || typeof activechat === 'undefined' ? '' : activechat.firebase_id)
  )

  const makeFileType = async() => {
    setfiletype('file')
  }

  return (
    <>
    {
    activechat === null || typeof activechat === 'undefined' ?
     'please wait' : 
     
      <div id="frame">
        <div id="sidepanel">
          <div id="contacts">
            <ul>
              {
                tableData.map((resto) => {
                  return (
                    <>
                      <li class={activechat.firebase_id === resto.firebase_id ? 'contact active': 'contact'} onClick = {() => activeChat(resto)}>
                        <div class="wrap">
                          <span class="contact-status online"></span>
                          <img src={resto.restaurent_logo} alt="" />
                          <div class="meta">
                            <p class="name">{resto.name}</p>
                          </div>
                        </div>
                      </li>
                    </>
                  )
                })
              }
            </ul>
          </div>
        </div>
        <div class="content">
          <div class="contact-profile">
            <img src={activechat.restaurent_logo} alt="" />
            <p>{activechat.name}</p>
            <div class="social-media">
              <i class="fa fa-facebook" aria-hidden="true"></i>
              <i class="fa fa-twitter" aria-hidden="true"></i>
              <i class="fa fa-instagram" aria-hidden="true"></i>
            </div>
          </div>
          <div class="messages">
            <ul>
              {
                messages
                  ?.sort((first, second) =>
                    first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
                  )
                  ?.map((messages) => {
                    return (
                      <>
                        <li className={messages.sender === 'admin' ? 'replies' : 'sent'}>
                          <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
                          {
                          messages.media ? 
                          <a href={messages.media} target="_blank"><img src={messages.media} alt="" width={450} style={{width: '200px', borderRadius: 0}}/></a>
                           :  <p>{messages.text}</p>
                          }
                         
                        </li>
                      </>
                    )
                  })
              }
            </ul>
            <div ref={bottomListRef} />
          </div>
          <div class="message-input">
          <form
          onSubmit={handleSubmit(handleOnSubmit)}
            // onSubmit={handleOnSubmit} 
            >
              {/* <input
                  type="mobile"
                  className="form-control"
                  name="mobile"
                  {...register("mobile")}
                  /> */}
            <div class="wrap">
              <input type="text" name="text" placeholder="Write your message..."
              // onChange={handleOnChange}
              {...register("text")}
              />


              <div class="image-upload">
              <label  for="file-input"style={{display: "block",backgroundColor:"red"}}>
              <i class="fa fa-paperclip fa-5x attachment mt-3"  aria-hidden="true"></i>
              </label>
                <input type="file" name="files" style={{display: 'none',}} id="file-input"
              {...register("files")} />
              </div>

              <button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
            </div>
            </form>
          </div>
        </div>
      </div>
}
      </>
      )
    
  }  

      export default Channel;
