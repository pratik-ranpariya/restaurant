import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AboutRestaurant from "./AboutRestaurant.jsx";
import History from "./History.jsx";
import Setting from "./Setting.jsx";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useGlobalContext } from "../../../context.js";

const Profile = () => {
  const { isSidebarOpen, data } = useGlobalContext();

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}
      >
        <div
          style={{
            padding: "15px",
            borderRadius: "20px",
            backgroundColor: "white",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <div style={{ height: "300px" }}>
            <img
              src={data.restaurent_cover ? data.restaurent_cover : 'https://cloud.indiaimagine.com/wp-content/uploads/2019/08/Indian_Food_Cover.jpg'}
              height="100%"
              width="100%"
              alt="no coverphoto"
            />
          </div>
          <div className="mt-3 px-2">
            <div
              className="mx-2"
              style={{
                height: "100px",
                width: "100px",
                marginTop: "-40px",
                float: "left",
              }}
            >
              <img
                className="rounded-circle"
                style={{ position: "relative" }}
                src={data.restaurent_logo ? data.restaurent_logo : 'https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png'}
                width="100%"
                height="100%"
                alt=""
              />
            </div>
            <div className="float-left mx-2">
              <p style={{ color: "#ea7a9a" }}>
                <strong>{data.name}</strong>
              </p>
              <p className="text-secondary">
                <strong>{data.city}</strong>
              </p>
            </div>
            <div className="float-left mx-2">
              <p className="fw-bold">
                <strong>{data.mobile}</strong>
              </p>
              <p className="text-secondary">
                <strong>{data.email}</strong>
              </p>
            </div>
            <div
              className="float-right d-flex rounded-circle align-items-center justify-content-center p-2"
              style={{
                color: "#ea7a9a",
                backgroundColor: "#fae7ee",
              }}
            >
              <HiOutlineDotsHorizontal />
            </div>
          </div>
          <div style={{ clear: "both" }} />
        </div>
        <div
          className="mt-5 p-4 pt-5"
          style={{
            // padding: "10px",
            color: "#8b8a8a",
            borderRadius: "20px",
            backgroundColor: "white",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <Tabs>
            <TabList style={{ fontSize: "1.3rem" }}>
              <Tab>
                <strong>About Restaurant</strong>
              </Tab>
              <Tab>
                <strong>Settings</strong>
              </Tab>
              <Tab>
                <strong>History</strong>
              </Tab>
            </TabList>

            <TabPanel>
              <AboutRestaurant />
            </TabPanel>
            <TabPanel>
              <Setting />
            </TabPanel>
            <TabPanel>
              <History />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Profile;
