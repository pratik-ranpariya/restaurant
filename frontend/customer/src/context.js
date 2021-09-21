import React, { useState, useContext, useReducer, useEffect } from "react";
import reducer from "./components/Reducer/reducer";
import axios from "axios";

// const url =
//   "http://64.225.86.46:4000/users/restaurant_menu?" +
//   window.location.href.split("?")[1];

const url =
  "https://app.scannmenu.com/users/restaurant_menu?" +
  window.location.href.split("?")[1];

const AppContext = React.createContext();

const initialState = {
  scan: false,
  loading: false,
  cart: [],
  total: 0,
  total_quantity: 0,
  incart: [],
  mkpymt: {},
  readMore: [],
  allTypes: [],
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [restoID, setrestoID] = useState(window.location.href.split("?")[1]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPopupId, setcurrentPopupId] = useState([]);
  const [popupname, setpopupname] = useState("");
  // const [orderDetail, setorderDetail] = useState({});

  const ReadMore = (id) => {
    dispatch({ type: "SHOW_DESC", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const openModal = (id, name) => {
    setcurrentPopupId(id);
    setpopupname(name);
    setIsModalOpen(true);
  };

  const closeModal = (id) => {
    setIsModalOpen(false);
  };

  const remove = (id) => {
    dispatch({ type: "REMOVE", payload: id });
  };

  const increase = (id) => {
    dispatch({ type: "INCREASE", payload: id });
    dispatch({ type: "ORDERED_ITEM", payload: id });
    dispatch({ type: "GET_TOTAL" });
  };

  const decrease = (id) => {
    dispatch({ type: "DECREASE", payload: id });
    dispatch({ type: "ORDERED_ITEM", payload: id });
    dispatch({ type: "GET_TOTAL" });
  };

  const onSubmit = (data) => {
    alert(JSON.stringify(data.desc));
    localStorage.setItem("desc", JSON.stringify(data));
  };

  const ordereditem = (id) => {
    dispatch({ type: "ORDERED_ITEM", payload: id });
  };

  useEffect(() => {
    ordereditem();
  }, [state.cart]);

  const makePayment = (paytype) => {
    dispatch({ type: "MAKE_PAYMENT", payload: paytype });
  };

  const fetchData = async () => {
    try {
    if (window.location.href.split("?")[1]) {
      dispatch({ type: "LOADING" });
      const response = await axios.get(url);
      if (response.data.status === 200) {
        const localData = JSON.parse(localStorage.getItem("menu"));
        const apiLink = localStorage.getItem("api");
        var readMoreDesc = [];

        for (let i = 0; i < response.data.data.menu.length; i++) {
          const elem = response.data.data.menu[i];
          initialState.allTypes.push(Object.values(elem.type));
          readMoreDesc.push({
            id: i + 1,
            status: false,
          });
        }

        dispatch({ type: "insert_desc", payload: readMoreDesc });

        if (!localData) {
          // if (localData.data._id !== response.data.data._id) {
          for (let i = 0; i < response.data.data.menu.length; i++) {
            const element = response.data.data.menu[i];
            element.quentity = 0;
            for (let j = 0; j < element.item.length; j++) {
              const sapItem = element.item[j];
              sapItem.sizequentity = 0;
            }
          }

          localStorage.setItem("menu", JSON.stringify(response.data));
          localStorage.setItem("api", url);
          localStorage.setItem("orderDetail", JSON.stringify({}));
          localStorage.setItem("desc", JSON.stringify({}));
          localStorage.setItem("orderHistory", JSON.stringify([]));

          const localDatas = JSON.parse(localStorage.getItem("menu"));

          dispatch({ type: "DISPLAY_ITEM", payload: localDatas.data.menu });
        } else {
          for (let i = 0; i < response.data.data.menu.length; i++) {
            const element = response.data.data.menu[i];
            element.quentity = 0;
            for (let j = 0; j < element.item.length; j++) {
              const sapItem = element.item[j];
              sapItem.sizequentity = 0;
            }
          }

          if (apiLink !== url) {
            // console.log(localData.data._id !== response.data.data._id, localData.data._id, response.data.data._id)
            localStorage.clear();
            localStorage.setItem("api", url);
            localStorage.setItem("menu", JSON.stringify(response.data));
            const newData = JSON.parse(localStorage.getItem("menu"));
            dispatch({ type: "DISPLAY_ITEM", payload: newData.data.menu });
          } else {
            if (
              JSON.stringify(localData.data) ===
              JSON.stringify(response.data.data)
            ) {
              dispatch({ type: "DISPLAY_ITEM", payload: localData.data.menu });
            } else {
              // localStorage.clear();
              localStorage.setItem("api", url);
              // localStorage.setItem("menu", JSON.stringify(response.data));
              const newData = JSON.parse(localStorage.getItem("menu"));
              dispatch({ type: "DISPLAY_ITEM", payload: newData.data.menu });
            }
          }
        }
      } else {
        alert(response.data.msg);
        console.log(response.data.msg);
      }
    } else {

      const idDataExist = JSON.parse(localStorage.getItem("menu"));

      if (idDataExist) {
        var readMoreDesc = [];
        for (let i = 0; i < idDataExist.data.menu.length; i++) {
          readMoreDesc.push({
            id: i + 1,
            status: false,
          });
        }

        dispatch({ type: "insert_desc", payload: readMoreDesc });
        dispatch({ type: "DISPLAY_ITEM", payload: idDataExist.data.menu });
      } else {
        const reloadgetdatas = localStorage.getItem("api");

        if (reloadgetdatas) {
          const reloadgetdata = new URL(localStorage.getItem("api"));
          const response = await axios.get(reloadgetdata);
          var readMoreDesc = [];
          for (let i = 0; i < response.data.data.menu.length; i++) {
            readMoreDesc.push({
              id: i + 1,
              status: false,
            });
          }
          dispatch({ type: "insert_desc", payload: readMoreDesc });

          for (let i = 0; i < response.data.data.menu.length; i++) {
            const element = response.data.data.menu[i];
            element.quentity = 0;
            for (let j = 0; j < element.item.length; j++) {
              const sapItem = element.item[j];
              sapItem.sizequentity = 0;
            }
          }

          localStorage.setItem("menu", JSON.stringify(response.data));
          const storeData = JSON.parse(localStorage.getItem("menu"));
          dispatch({ type: "DISPLAY_ITEM", payload: storeData.data.menu });
        } else {
          dispatch({ type: "SCAN_AGAIN" });
        }
      }
    }
    } catch (e) {
      alert(e.message)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    dispatch({ type: "GET_TOTAL" });
  }, [state.cart]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        url,
        clearCart,
        isModalOpen,
        openModal,
        closeModal,
        remove,
        increase,
        decrease,
        ordereditem,
        restoID,
        makePayment,
        currentPopupId,
        popupname,
        onSubmit,
        // readMore,
        ReadMore,
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
