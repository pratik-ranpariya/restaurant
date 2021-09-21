import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gpay_icon from "./gpay_icon.svg";
import paytm_icon from "./payment.png";
import { useGlobalContext } from "../../context";
import { useHistory } from "react-router-dom";
import GooglePayButton from "@google-pay/button-react";
import axios from 'axios';

const { googlePayClient } = window;

console.log(googlePayClient, '===');

const baseCardPaymentMethod = {
  type: "CARD",
  parameters: {
    allowedCardNetworks: ["VISA", "MASTERCARD"],
    allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"]
  }
};

const googlePayBaseConfiguration = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [baseCardPaymentMethod]
};


const Payment = () => {
  const [pyment, setpyment] = useState('');
  const [googlePay, setgooglePay] = useState({
    googlepay_merchant_id: "",
    googlepay_merchant_name: ""
  })
  let history = useHistory();

  const { total, total_quantity, makePayment } = useGlobalContext();

  const gPay = async() => {
    try {
      const localData = JSON.parse(localStorage.getItem("menu"));
      const gpayid = await axios.get("https://app.scannmenu.com/users/getupi?restaurant_id="+localData.data._id)
      if(gpayid.data.status === 200){
        setgooglePay({
          googlepay_merchant_id: gpayid.data.data.googlepay_merchant_id,
          googlepay_merchant_name: gpayid.data.data.googlepay_merchant_name
        })
      } else {
        alert (gpayid.data.msg)
      }
    } catch (e) {
      alert(e.message)
    }
  }

// ==============================================================================================================================
  
const [gPayBtn, setGPayBtn] = useState(null);

  function createAndAddButton() {
    if (googlePayClient) {
      const googlePayButton = googlePayClient.createButton({
        buttonColor: "default",

        buttonType: "long",

        onClick: processPayment
      });

      setGPayBtn(googlePayButton);
    }
  }

  function processPayment() {
    console.log("test");
    const tokenizationSpecification = {
      type: "PAYMENT_GATEWAY",
      // parameters: {
      //   gateway: "stripe",
      //   "stripe:version": "v3",
      //   "stripe:publishableKey": "pk_test_35p114pH8oNuHX72SmrvsFqh00Azv3ZaIA"
      // }
      parameters: {
        gateway: "example",
        gatewayMerchantId: "exampleGatewayMerchantId",
      },
    };

    const cardPaymentMethod = {
      type: "CARD",
      tokenizationSpecification: tokenizationSpecification,
      parameters: {
        allowedCardNetworks: ["VISA", "MASTERCARD"],
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        billingAddressRequired: true,
        billingAddressParameters: {
          format: "FULL",
          phoneNumberRequired: true
        }
      }
    };

    const transactionInfo = {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: (total + (total * 18) / 100).toString(),
      currencyCode: "INR",
      countryCode: "IN",
    };

    const merchantInfo = {
      merchantId: googlePay.googlepay_merchant_id,
      merchantName: googlePay.googlepay_merchant_name
    };

    const paymentDataRequest = {
      ...googlePayBaseConfiguration,
      ...{
        allowedPaymentMethods: [cardPaymentMethod],
        transactionInfo,
        merchantInfo
      }
    };

    googlePayClient
      .loadPaymentData(paymentDataRequest)
      .then(function (paymentData) {
        makePayment("google_pay");
        window.location = "https://scannmenu.com/myorders";
        console.log(paymentData, '0000=');
      })
      .catch(function (err) {
        console.log(err, '---0');
      });
  }

  useEffect(() => {
    googlePayClient
      .isReadyToPay(googlePayBaseConfiguration)
      .then(function (response) {
        if (response.result) {
          createAndAddButton();
        } else {
          alert("Unable to pay using Google Pay");
        }
      })
      .catch(function (err) {
        console.error("Error determining readiness to use Google Pay: ", err);
      });
  }, []);


// ==============================================================================================================================



  if(!total_quantity){
    history.push("/");
  }

  useEffect(() => {
    gPay()
  }, [])

  return (
    <>
      <div>
        <div className="container mt-4">
          <div className="d-flex align-items-center">
            <Link to="/billdetails">
              <div>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ backgroundColor: "rgb(223, 220, 220)" }}
                >
                  <i
                    className="fa fa-angle-left 2x"
                    style={{ color: "black" }}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </Link>
            <div style={{ padding: "0px 2px" }}>
              <h6
                className="font-weight-bold ml-1 mb-0"
                style={{ color: "#8492a6" }}
              >
                Payment Options
              </h6>
              <p className="ml-1 mb-0" style={{ color: "gray" }}>
                <small>
                  {total_quantity} items, &nbsp; To Pay :{" "}
                  {(total + (total * 18) / 100).toFixed(2)}
                </small>
              </p>
            </div>
          </div>
          <hr />
        </div>
        <div className="container mt-4 px-4">
          {/* <GooglePayButton
            className="mt-2"
            environment="TEST"
            paymentRequest={{
              apiVersion: 2,
              apiVersionMinor: 0,
              allowedPaymentMethods: [
                {
                  type: "CARD",
                  parameters: {
                    allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                    allowedCardNetworks: ["MASTERCARD", "VISA"],
                  },
                  tokenizationSpecification: {
                    type: "PAYMENT_GATEWAY",
                    parameters: {
                      gateway: "example",
                      gatewayMerchantId: "exampleGatewayMerchantId",
                    },
                  },
                },
              ],
              merchantInfo: {
        //        merchantId: "12313212131321313", //dynamic id
          //      merchantName: "Roxon",
             merchantId: googlePay.googlepay_merchant_id,
                merchantName: googlePay.googlepay_merchant_name
              },
              transactionInfo: {
                totalPriceStatus: "FINAL",
                totalPriceLabel: "Total",
                totalPrice: (total + (total * 18) / 100).toString(),
                currencyCode: "INR",
                countryCode: "IN",
              },
              shippingAddressRequired: true,
              callbackIntents: ["SHIPPING_ADDRESS", "PAYMENT_AUTHORIZATION"],
            }}
            onLoadPaymentData={(paymentRequest) => {
              console.log("Success", paymentRequest);
              makePayment("google_pay");
              window.location = "https://scannmenu.com/myorders";
            }}
            onPaymentAuthorized={(paymentData) => {
              console.log("Payment Authorised Success", paymentData);
              return { transactionState: "SUCCESS" };
            }}
            onPaymentDataChanged={(paymentData) => {
              console.log("On Payment Data Changed", paymentData);
              return {};
            }}
            buttonType="short"
            existingPaymentMethodRequired="false"
            buttonColor="white"
            // buttonType='Buy'
          > */}
          {/* <div dangerouslySetInnerHTML={{ __html: gPayBtn && gPayBtn.innerHTML }}> </div> */}

            <div className="d-flex justify-content-between mt-2" >
              <div className="d-flex align-items-center">
                <img
                  src={gpay_icon}
                  alt="Amazon"
                  style={{
                    padding: "5px",
                  width: "70px",
                  height:"30px",
                  }}
                />
              </div>
              
              <input type="radio" name="payment" onClick={() => setpyment('gpay')} style={{alignSelf: 'center'}} />
            </div>
            
          <div
            className="d-flex justify-content-between mt-3"
            // onClick={() => setpyment("paytm")}
          >
            <div className="d-flex align-items-center">
              <img
                src={paytm_icon}
                alt="Amazon"
                style={{
                  padding: "5px",
                  width: "100px",
                }}
              />
            </div>

            <input type="radio" name="payment" onClick={() => setpyment('paytm')} style={{alignSelf: 'center'}} />
          </div>
        </div>
        <div className="container mt-4 px-4">
          {/* <hr /> */}
          <div className="d-flex justify-content-between">
            <h5>
              <strong style={{marginLeft: '2px'}}>Cash</strong>
            </h5>
            <div>
              <input type="radio" name="payment" onClick={() => setpyment('cod')} style={{alignSelf: 'center'}}/>
            </div>
          </div>
          {/* <div className="container mb-5" style={{ marginTop: "100px" }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block text-center"
                style={{ backgroundColor: "green", border: "none" }}
                // onClick={}
              >
                Place Order
              </button>
            </div> */}
          {pyment ? pyment === 'paytm' ? <div className="container mb-5" style={{ marginTop: "100px" }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block text-center"
                  style={{ backgroundColor: "green", border: "none" }}
                  onClick={() => makePayment(pyment)}
                >
                  Place Order
                </button>
              </div> : pyment === 'gpay' ? <div className="container mb-5" style={{ marginTop: "100px" }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block text-center"
                  style={{ backgroundColor: "green", border: "none" }}
                  onClick={processPayment}
                >
                  Place Order
                </button>
              </div> : (
            <Link to="/myorders">
              <div className="container mb-5" style={{ marginTop: "100px" }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block text-center"
                  style={{ backgroundColor: "green", border: "none" }}
                  onClick={() => makePayment(pyment)}
                >
                  Place Order
                </button>
              </div>
            </Link>
          ) : (
            <div className="container mb-5" style={{ marginTop: "100px" }}>
              <button
                disabled
                type="button"
                className="btn btn-primary btn-lg btn-block text-center"
                style={{ backgroundColor: "green", border: "none" }}
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;

