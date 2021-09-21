import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Forgot from "./forgot";
import Login from "./Login";
import Newpassword from "./Newpassword";
import OTP from "./OTP";

const Startup = () => {
  //   var login = false;
  //   if (localStorage.getItem("user")) {
  //     login = true;
  //   }

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/forgot">
          <Forgot />
        </Route>
        <Route exact path="/OTP">
          <OTP />
        </Route>
        <Route exact path="/newpassword">
          <Newpassword />
        </Route>
      </Switch>
    </>
  );
};

export default Startup;
