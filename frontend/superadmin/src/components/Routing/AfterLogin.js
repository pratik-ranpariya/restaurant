import React from "react";
import Navbar from "../home/Navbar";
import Sidebar from "../home/Sidebar";
import Dashboard from "../superAdmin/Dashboard/Dashboard";
import AddSubAdmin from "../superAdmin/AddSubAdmin/AddSubAdmin";
import RestaurantDetails from "../superAdmin/RestaurantDetails/RestaurantDetails";
import ManageSubscription from "../superAdmin/ManageSubscription/ManageSubscription";
import AddSubscription from "../superAdmin/AddSubscription/AddSubscription";
import Status from "../superAdmin/Status/Status";
import AutoReneue from "../superAdmin/AutoReneue/AutoReneue";
import Logout from "./Logout";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import Restaurant from "../superAdmin/RestaurantDetails/Restaurant";
import Chat from '../superAdmin/chat/message'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AfterLogin = () => {
  var login = false;
  if (localStorage.getItem("user")) {
    login = true;
  }

  let query = useQuery();

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
        <Route exact path="/AddSubAdmin">
          <AddSubAdmin />
        </Route>
        <Route exact path="/RestaurantDetails">
          <RestaurantDetails />
        </Route>
        <Route exact path="/RestaurantDetails/Restaurant">
          <Restaurant id={query.get("name")} />
        </Route>
        <Route exact path="/ManageSubscription">
          <ManageSubscription />
        </Route>
        <Route exact path="/AddSubscription">
          <AddSubscription />
        </Route>
        <Route exact path="/Status">
          <Status />
        </Route>
        <Route exact path="/AutoReneue">
          <AutoReneue />
        </Route>
        <Route exact path="/chat">
          <Chat />
        </Route>
        <Route exact path="/logout">
          <Logout />
        </Route>
      </Switch>
    </>
  );
};

export default AfterLogin;