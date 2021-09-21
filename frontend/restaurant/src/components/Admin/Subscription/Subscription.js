import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useGlobalContext } from "../../../context.js";
import Restaurant from "./Restaurant.jsx";
import TakeAway from "./TakeAway.jsx";
import Hotel from "./Hotel.jsx";

const Subscription = () => {
  const { isSidebarOpen } = useGlobalContext();

  return (
    <div
      className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}
      //   className="text-center  align-items-center mt-5 "
    >
      <div
        className="mt-5 pt-2 text-secondary"
        style={{
          // padding: "10px",
          borderRadius: "20px",
          backgroundColor: "white",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
      >
        <h3 className="pl-3 pt-2">
          <strong>Plans</strong>
        </h3>
        <hr />
        <Tabs className="text-center">
          <TabList style={{ borderBottom: "none" }}>
            <Tab
              // className={styles.abc}
              style={
                {
                  // backgroundColor:
                  //   className === "react-tabs__tab--selected" ? "red" : "green",
                }
              }
            >
              <strong>Take away</strong>
            </Tab>
            <Tab>
              <strong>Restaurant </strong>
            </Tab>
            <Tab>
              <strong>Hotel</strong>
            </Tab>
          </TabList>

          <TabPanel>
            <TakeAway />
          </TabPanel>
          <TabPanel>
            <Restaurant />
          </TabPanel>
          <TabPanel>
            <Hotel />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Subscription;
