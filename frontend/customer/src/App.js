import React from "react";
import Menu from "./components/Menu/Menu";
import BillDetails from "./components/BillDetails/BillDetails";
import Payment from "./components/PaymentOptions/Payment";
import Myorders from "./components/MyOrders/Myorders";
import { useGlobalContext } from "./context";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Loader from "react-loader-spinner";

function App() {
  const { loading,scan } = useGlobalContext();
  if (loading) {
    return (
     /* <div className="loading">
        <h1>Loading...</h1>
      </div> */
     <Loader 
      
      style={{ 
        position: "fixed",
        top: "50%",
        left: "45%",
        transform: "translate(-50%, -50%)",
        transform: "-webkit-translate(-50%, -50%)",
        transform: "-moz-translate(-50%, -50%)",
        transform: "-ms-translate(-50%, -50%)"
       }}

        type="Oval"
        color="green"
        secondaryColor="gray"
        height={50}
        width={50}
        // timeout={3000}
      />

    );
  }
  if (scan) {
    return (
      <div className="loading">
        <h1>Scan Again</h1>
      </div>
    );
  }
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Menu />
          </Route>
          <Route exact path="/billdetails">
            <BillDetails />
          </Route>
          <Route exact path="/payment">
            <Payment />
          </Route>
          <Route exact path="/myorders">
            <Myorders />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
