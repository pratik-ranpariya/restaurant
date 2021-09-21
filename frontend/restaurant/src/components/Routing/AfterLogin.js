import React from "react";
import Navbar from "../home/Navbar";
import Sidebar from "../home/Sidebar";
import Dashboard from "../Admin/Dashboard/Dashboard";
import Orders from "../Admin/OrderTable/Orders";
import Subscription from "../Admin/Subscription/Subscription";
// import Subscriptions from "../Admin/Subscription/Subscriptions";
import UpdateDetails from "../Admin/Update_details/Update_details";
import Chat from '../chat/message'
import Profile from "../Admin/Profile/Profile";
import Logout from "./Logout";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Startup = () => {
  var login = false;
  if (localStorage.getItem("user")) {
    login = true;
  }

  return (
    <>
  <Navbar />
      <Sidebar />
      <Switch>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <Route exact path="/Dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/Orders">
          <Orders />
        </Route>
        <Route exact path="/Update_details">
          <UpdateDetails />
        </Route>
        <Route exact path="/subscription">
          <Subscription />
        </Route>
          <Route exact path="/logout">
          <Logout />
        </Route>
          <Route exact path="/chat">
          <Chat />
        </Route>
        {/* <Route path="/person/:id" children={<Person />}></Route>
        <Route path="*">
          <Error />
        </Route> */}
      </Switch>
    </>
  );
};

export default Startup;
