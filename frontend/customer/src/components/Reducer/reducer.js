import React from "react";
import axios from "axios";
import Receipt from "../Receipt/Receipt";

const reducer = (state, action) => {
  if (action.type === "CLEAR_CART") {
    return { ...state, mkpymt: {} };
  }

  if (action.type === "insert_desc") {
    return { ...state, readMore: action.payload };
  }

  if (action.type === "REMOVE") {
    return {
      ...state,
      cart: state.cart.filter((cartItem) => cartItem.id !== action.payload),
    };
  }

  if (action.type === "SHOW_DESC") {
    for (let i = 0; i < state.readMore.length; i++) {
      const element = state.readMore[i];
      if (action.payload === element.id) {
        element.status = !element.status;
      }
    }
    return {
      ...state,
      readMore: state.readMore,
    };
  }

  if (action.type === "INCREASE") {
    for (let i = 0; i < state.cart.length; i++) {
      const element = state.cart[i];
      for (let j = 0; j < element.item.length; j++) {
        const sapid = element.item[j];
        if (sapid._id === action.payload) {
          sapid.sizequentity += 1;
          element.quentity += 1;
        }
      }
    }
    const localData = JSON.parse(localStorage.getItem("menu"));
    if (localData.data.dining_number) {
      var storeData = {
        data: {
          menu: state.cart,
          dining_number: localData.data.dining_number,
          _id: localData.data._id,
        },
        status: 200,
      };
    } else if (localData.data.room_number) {
      var storeData = {
        data: {
          menu: state.cart,
          room_number: localData.data.room_number,
          _id: localData.data._id,
        },
        status: 200,
      };
    } else {
      var storeData = {
        data: { menu: state.cart, _id: localData.data._id },
        status: 200,
      };
    }
    localStorage.setItem("menu", JSON.stringify(storeData));
    return { ...state, cart: state.cart };
  }

  if (action.type === "DECREASE") {
    for (let i = 0; i < state.cart.length; i++) {
      const element = state.cart[i];
      for (let j = 0; j < element.item.length; j++) {
        const sapid = element.item[j];
        if (sapid._id === action.payload) {
          sapid.sizequentity -= 1;
          element.quentity -= 1;
        }
      }
    }
    const localData = JSON.parse(localStorage.getItem("menu"));
    if (localData.data.dining_number) {
      var storeData = {
        data: {
          menu: state.cart,
          dining_number: localData.data.dining_number,
          _id: localData.data._id,
        },
        status: 200,
      };
    } else if (localData.data.room_number) {
      var storeData = {
        data: {
          menu: state.cart,
          room_number: localData.data.room_number,
          _id: localData.data._id,
        },
        status: 200,
      };
    } else {
      var storeData = {
        data: { menu: state.cart, _id: localData.data._id },
        status: 200,
      };
    }

    localStorage.setItem("menu", JSON.stringify(storeData));
    return { ...state, cart: state.cart };
  }

  if (action.type === "ORDERED_ITEM") {
    var mycart = [];
    for (let i = 0; i < state.cart.length; i++) {
      const element = state.cart[i];
      if (element.quentity > 0) {
        for (let j = 0; j < element.item.length; j++) {
          const sapid = element.item[j];
          if (sapid.sizequentity > 0) {
            var myobject = {
              _id: element._id,
              id: element.id,
              name: element.name,
              category: element.category,
              image: element.image,
              sizeid: sapid._id,
              size: sapid.size,
              price: sapid.price.toFixed(2),
              sizequentity: sapid.sizequentity,
            };
            mycart.push(myobject);
          }
        }
      }
    }

    return {
      ...state,
      incart: mycart,
    };
  }

  if (action.type === "GET_TOTAL") {
    var price = 0,
      total_quantity = 0;
    for (let i = 0; i < state.cart.length; i++) {
      const element = state.cart[i];
      for (let j = 0; j < element.item.length; j++) {
        const getprice = element.item[j];
        if (getprice.sizequentity > 0) {
          price += getprice.price * getprice.sizequentity;
        }
      }
      total_quantity += element.quentity;
    }

    price = parseFloat(price.toFixed(2));

    return { ...state, total: price, total_quantity };
  }

  if (action.type === "MAKE_PAYMENT") {
    const localData = JSON.parse(localStorage.getItem("menu"));
    var desc = JSON.parse(localStorage.getItem("desc"));
    if (localData.data.room_number) {
      var typpe = {
        type: "hotel",
        table_number: null,
        room_number: localData.data.room_number,
      };
    } else if (localData.data.dining_number) {
      var typpe = {
        type: "dining_table",
        table_number: localData.data.dining_number,
        room_number: null,
      };
    } else {
      var typpe = {
        type: "take_away",
        table_number: null,
        room_number: null,
      };
    }

    var item = [];
    for (let i = 0; i < state.cart.length; i++) {
      const element = state.cart[i];
      if (element.quentity > 0) {
        for (let j = 0; j < element.item.length; j++) {
          const sapid = element.item[j];
          if (sapid.sizequentity > 0) {
            var myobject = {
              _id: element._id,
              name: element.name,
              category: element.category,
              sizeid: sapid._id,
              size: sapid.size,
              price: sapid.price,
              quentity: sapid.sizequentity,
	      image: element.image
            };
            item.push(myobject);
          }
        }
      }
    }
    var mkPayment = {
      restaurant_id: localData.data._id,
      totalprice: (state.total * 18) / 100 + state.total,
      payment_type: action.payload,
      payment_status: "success",
      start_time: new Date(),
      type: typpe,
      item,
      desc: desc === null ? "" : desc.desc,
    };
    // const API = "http://64.225.86.46:4000/users/order";
    const API = "https://app.scannmenu.com/users/order";
    // const API = "http://localhost:5050/users/order";

    if (action.payload === "cod") {
      var orderData;

      mkPayment.payment_status = "pending";
      axios
        .post(API, mkPayment)
        .then((callAPI) => {
          if (callAPI.data.status === 200) {
            localStorage.removeItem("menu");
            localStorage.setItem("orderDetail", JSON.stringify(callAPI.data));
            orderData = JSON.parse(localStorage.getItem("orderDetail"));
          } else {
          }
        })
        .catch((e) => {
        });
    } else if (action.payload === "google_pay") {
      var orderData;

      mkPayment.payment_status = "success";
      axios
        .post(API, mkPayment)
        .then((callAPI) => {
          if (callAPI.data.status === 200) {
            localStorage.removeItem("menu");
            localStorage.setItem("orderDetail", JSON.stringify(callAPI.data));
            orderData = JSON.parse(localStorage.getItem("orderDetail"));
          } else {
          }
        })
        .catch((e) => {
        });
    } else if (action.payload === "paytm") {
      mkPayment.payment_status = "failed";
      axios
        .post(API, mkPayment)
        .then((callAPI) => {
          if (callAPI.data.status === 200) {
         //   localStorage.removeItem("menu");
            localStorage.setItem("orderDetail", JSON.stringify(callAPI.data));
            orderData = JSON.parse(localStorage.getItem("orderDetail"));

            var sendData = {
              order_id: callAPI.data.data.order_id,
              totalprice: callAPI.data.data.totalprice,
              restaurant_id: callAPI.data.data.restaurant_id
	    };

            // axios.post("http://localhost:5050/users/paytm", sendData).then((paytmData) => {
            const getData = (data) => {
              return fetch(`https://app.scannmenu.com/users/paytm`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .catch((err) => console.log(err));
            };

            getData(sendData)
              .then((response) => {
                var information = {
                  action: "https://securegw-stage.paytm.in/order/process",
                  params: response,
                };

                function isDate(val) {
                  return (
                    Object.prototype.toString.call(val) === "[object Date]"
                  );
                }

                function isObj(val) {
                  return typeof val === "object";
                }

                function stringifyValue(val) {
                  if (isObj(val) && !isDate(val)) {
                    return JSON.stringify(val);
                  } else {
                    return val;
                  }
                }

                function buildForm({ action, params }) {
                  const form = document.createElement("form");
                  form.setAttribute("method", "post");
                  form.setAttribute("action", action);

                  Object.keys(params).forEach((key) => {
                    const input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", key);
                    input.setAttribute("value", stringifyValue(params[key]));
                    form.appendChild(input);
                  });
                  return form;
                }

                function post(details) {
                  const form = buildForm(details);
                  // return
                  document.body.appendChild(form);
                  form.submit();
                  form.remove();
                }

                post(information);
              })
              .catch((e) => {
                console.log(e, "------after paytm api called get error");
              });
          } else {
            console.log(callAPI.data.msg);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    return {
      ...state,
      mkpymt: mkPayment,
      // incart: [],
      // total: 0,
      // total_quantity: 0,
    };
  }

  if (action.type === "NULL_MKPYMT") {
    return { ...state, mkpymt: {} };
  }

  if (action.type === "LOADING") {
    return { ...state, loading: true };
  }
  if (action.type === "SCAN_AGAIN") {
    return { ...state, scan: true };
  }

  if (action.type === "DISPLAY_ITEM") {
    return { ...state, cart: action.payload, loading: false };
  }

  throw new Error("No Matching Action Type");
};

export default reducer;
