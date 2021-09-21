import React, { useState } from "react";
import AfterLogin from "./components/Routing/AfterLogin";
import BeforeLogin from "./components/Routing/BeforeLogin";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { onMessageListener } from "./components/firebase/firebase";
import { Button, Row, Col, Toast } from "react-bootstrap";

function App() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });

   onMessageListener()
    .then((payload) => {
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));
  var login = false;
  if (localStorage.getItem("user")) {
    login = true;
  }
  return (
    <>
      <Toast onClose={() => setShow(false)} show={show} delay={10000} autohide animation style={{
          position: 'absolute',
          top: 20,
          right: 20,
          minWidth: 200,
          background: 'rgb(234, 122, 154)',
          zIndex: '9999999999999999999999999999999'
        }}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">{notification.title}</strong>
	  {/*   <small>just now</small> */}
          </Toast.Header>
	  {/*   <Toast.Body>{notification.body}</Toast.Body>*/}
        </Toast>
      <Router>{login ? <AfterLogin /> : <BeforeLogin />}</Router>
    </>
  );
}

export default App;
