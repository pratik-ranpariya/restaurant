import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [Title, setTitle] = useState(window.location.href.split("3001/")[1]);
  const [addRestaurant, setAddRestaurant] = useState(false);
  const [addLogo, setAddLogo] = useState(false);
  const [addMenu, setAddMenu] = useState(false);
  const [addUPI, setAddUPI] = useState(false);
  const [addimage, setAddimage] = useState(false);
  const [accept_order, setaccept_order] = useState(false);
  const [cancel_order, setcancel_order] = useState(false);
  const [size, setSize] = useState(window.innerWidth);

  // const baseUrl = "http://64.225.86.46:4000";
  // const baseUrl = "http://localhost:4000";
  const baseUrl = "https://app.scannmenu.com";

  const forgotpass = baseUrl + "/restaurants/forgotpassword";

  const verifyotp = baseUrl + "/restaurants/verifyotp";

  const newpassword = baseUrl + "/restaurants/newpassword";

  const dashboardcount = baseUrl + "/restaurants/todayorder";

  const neworder = baseUrl + "/restaurants/neworder";

  const graph = baseUrl + "/restaurants/graph";

  const qrcode = baseUrl + "/restaurants/all_qrcode";

  const ordersTable = baseUrl + "/restaurants/today_order_details";

  const uploadnamelogo = baseUrl + "/restaurants/profile_update";

  const uploadmenu = baseUrl + "/restaurants/menu";

  const uploadimage = baseUrl + "/restaurants/image_upload";

  const changeorderstatus = baseUrl + "/restaurants/change_order_status";

  const changepaymentstatus = baseUrl + "/restaurants/change_payment_status";

  const subcriptionplan = baseUrl + "/restaurants/subcription";

  const subhistory = baseUrl + "/restaurants/subcription_history";

  const aboutrestro = baseUrl + "/restaurants/profile";

  const allOrders = baseUrl + "/restaurants/allorders";

  const updateUPI = baseUrl + "/restaurants/updateupi";

  const chatFileUpload = baseUrl + "/superadmin/chatFileupload"

  const restaurantStatus = baseUrl + "/restaurants/restaurantstatus"

  const [countData, setCountData] = useState({
    delevered: 0,
    pending: 0,
    cancel: 0,
  });

  const [lastValue, setlastValue] = useState(parseInt(countData.pending));
  const [data, setdata] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      (async () => {
        const getToken = localStorage.getItem("user");
        var myToken = JSON.parse(getToken);

        const fetchApi = await axios.get(aboutrestro, {
          headers: { Authorization: myToken.token },
        });

        if (fetchApi.data.status === 200) {
          setdata(fetchApi.data.data);
        } else {
          alert(fetchApi.data.msg);
        }
      })();
    }
  }, []);

  const todaydata = async () => {
   if (localStorage.getItem("user")) {
    const getToken = localStorage.getItem("user");
    var myToken = JSON.parse(getToken);

    const fetchApi = await axios.get(dashboardcount, {
      headers: { Authorization: myToken.token },
    });

    if (fetchApi.status === 200) {
      setCountData(fetchApi.data.data);
      if (lastValue !== countData.pending) {
        setlastValue(countData.pending);
      }
    } else {
    }
   }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setTimeout(() => {
        todaydata();
      }, 5000);
    }
  }, [countData]);


  var inactivityTime = function () {
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;

    function logout() {
      alert("Please Reaload The Page");
      window.location.reload();
      //location.href = 'logout.js'
    }

    function resetTimer() {
      if (localStorage.getItem("user")) {
        clearTimeout(time);
        time = setTimeout(logout, 1800000);
      }
    }
  };

  window.onload = function () {
    inactivityTime();
  };

  
  var portNumber = "com/";

  const titlename = () => {
    if (window.location.href.split(portNumber)[1] === "Orders") {
      setTitle("Orders");
    } else if (window.location.href.split(portNumber)[1] === "Update_details") {
      setTitle("Update Details");
    } else if (window.location.href.split(portNumber)[1] === "Dashboard") {
      setTitle("Dashboard");
    } else if (window.location.href.split(portNumber)[1] === "subscription") {
      setTitle("Subscription");
    } else if (window.location.href.split(portNumber)[1] === "chat") {
      setTitle("Send a Message");
    } else {
      setTitle("Dashboard");
    }
  };

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
  const openaddRestaurant = () => {
    setAddRestaurant(true);
  };
  const closeaddRestaurant = () => {
    setAddRestaurant(false);
  };
  const openaddLogo = () => {
    setAddLogo(true);
  };
  const closeaddLogo = () => {
    setAddLogo(false);
  };
  const openaddMenu = () => {
    setAddMenu(true);
  };
  const closeaddMenu = () => {
    setAddMenu(false);
  };
  const openaddUPI = () => {
    setAddUPI(true);
  };
  const closeaddUPI = () => {
    setAddUPI(false);
  };
  const openaddimage = () => {
    setAddimage(true);
  };
  const closeaddimage = () => {
    setAddimage(false);
  };
  const openaccept_order = () => {
    todaydata();
    setaccept_order(true);
  };
  const closeaccept_order = () => {
    setaccept_order(false);
  };
  const opencancel_order = () => {
    setcancel_order(true);
  };
  const closecancel_order = () => {
    setcancel_order(false);
  };

  return (
    <AppContext.Provider
      value={{
	updateUPI,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        forgotpass,
        verifyotp,
        addRestaurant,
        newpassword,
        openaddRestaurant,
        closeaddRestaurant,
        addLogo,
        openaddLogo,
        closeaddLogo,
        addMenu,
        openaddMenu,
        closeaddMenu,
        addUPI,
        restaurantStatus,
        openaddUPI,
        closeaddUPI,
        addimage,
        chatFileUpload,
        openaddimage,
        closeaddimage,
        accept_order,
        openaccept_order,
        closeaccept_order,
        cancel_order,
        opencancel_order,
        closecancel_order,
        smallSidebar,
        baseUrl,
        neworder,
        graph,
        qrcode,
        ordersTable,
        uploadmenu,
        uploadnamelogo,
        uploadimage,
        size,
        changeorderstatus,
        changepaymentstatus,
        dashboardcount,
        countData,
        todaydata,
        subcriptionplan,
        Title,
        subhistory,
        aboutrestro,
        data,
        allOrders,
        lastValue,
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
