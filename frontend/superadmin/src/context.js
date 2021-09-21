import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const splitt = "com/"
  const [Title, setTitle] = useState(window.location.href.split(splitt)[1]);
  const [size, setSize] = useState(window.innerWidth);
  
  const baseUrl = "https://app.scannmenu.com";
  // const baseUrl = "http://64.225.86.46:4000";
  // const baseUrl = "http://localhost:5050";


  const dashboardCount = baseUrl + "/superadmin/dashboardCount";

  const restaurants_details_table = baseUrl + "/superadmin/restaurants_table";

  const graphs = baseUrl + "/superadmin/graph"

  const manageubscription = baseUrl + "/superadmin/restaurant_subcription";

  const restaurantSubcriptionModify =
    baseUrl + "/superadmin/restaurant_subcription_modify";

  const restaurant_status_table =
    baseUrl + "/superadmin/restaurant_status_table";

  const Add_SubAdmin = baseUrl + "/superadmin/create_rest_account";

  // const Add_Subscription = baseUrl + "/superadmin/manualy_sub_buy";

  const Add_Subscription = baseUrl + "/superadmin/manualy_sub_buy";

  const generate_receipt_table = baseUrl + "/superadmin/restaurant_generate_receipt_table";
  
  const generate_receipt = baseUrl + "/superadmin/generate_receipt";
  
  const restaurant_dashboard = baseUrl + "/superadmin/rastaurent_detail";

  const restaurant_graph = baseUrl + "/superadmin/rastaurent_graph";

  const in_firebase_id = baseUrl + "/superadmin/insert_firebase_id";

  const chatFileUpload = baseUrl + "/superadmin/chatFileupload"

   const forgotpass = baseUrl + "/superadmin/forgotpassword";

  const verifyotp = baseUrl + "/superadmin/verifyotp";

  const newpassword = baseUrl + "/superadmin/newpassword";

  const changeStatusSubcription = baseUrl + "/superadmin/change_subcription_status";

  const subcriptionHistory = baseUrl + "/superadmin/subcription_history"

  const getRestoSubcription = baseUrl + "/superadmin/profile";

  const editSubcriptionDetails = baseUrl + "/superadmin/editsubcriptiondetails";

  const [countData, setCountData] = useState({
    delevered: 0,
    pending: 0,
    cancel: 0,
  });

  const todaydata = async () => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
  
      const fetchApi = await axios.get(dashboardCount, {
        headers: { Authorization: myToken.token },
      });
      if (fetchApi.status === 200) {
        setCountData(fetchApi.data.data);
      }
    } catch (e) {
      Swal.fire({
        title: "Ohh no!",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      todaydata();
    }
  }, []);

  const checkSize = () => {
    setSize(window.innerWidth);
  };

  useEffect(() => {
    titlename();
    window.addEventListener("resize", checkSize);
    return () => {
      window.removeEventListener("resize", checkSize);
    };
  });

  const titlename = () => {
    if (window.location.href.split(splitt)[1] === "AddSubAdmin") {
      setTitle("Add Sub Admin");
    } else if (window.location.href.split(splitt)[1] === "Dashboard") {
      setTitle("Dashboard");
    } else if (window.location.href.split(splitt)[1] === "RestaurantDetails") {
      setTitle("View Restaurant Detail");
    } else if (window.location.href.split(splitt)[1] === "Restaurant") {
      setTitle("Restaurant");
    } else if (window.location.href.split(splitt)[1] === "ManageSubscription") {
      setTitle("Manage Subscription");
    } else if (window.location.href.split(splitt)[1] === "AddSubscription") {
      setTitle("Add Subscription");
    } else if (window.location.href.split(splitt)[1] === "AutoReneue") {
      setTitle("Auto Reneue");
    }else if (window.location.href.split(splitt)[1] === "chat") {
      setTitle("Message");
    } else if (window.location.href.split(splitt)[1] === "Status") {
      setTitle("Status");
    }
  };
  const smallSidebar = () => {
    titlename();
    if (size <= 670) {
      setIsSidebarOpen(false);
    }
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        getRestoSubcription,
	subcriptionHistory,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        graphs,
        size,
        Title,
        smallSidebar,
        baseUrl,
        dashboardCount,
        Add_SubAdmin,
        Add_Subscription,
        restaurants_details_table,
        manageubscription,
        restaurantSubcriptionModify,
        restaurant_status_table,
        generate_receipt,
        generate_receipt_table,
        restaurant_dashboard,
        restaurant_graph,
        in_firebase_id,
        chatFileUpload,
        forgotpass,
        editSubcriptionDetails,
        verifyotp,
        newpassword,
        changeStatusSubcription
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
