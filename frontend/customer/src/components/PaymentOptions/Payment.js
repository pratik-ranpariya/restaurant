import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import gpay_icon from "./gpay_icon.svg";
import paytm_icon from "./payment.png";
import ruppes_icon from "./rupees_icon.jpeg"
import { useGlobalContext } from "../../context";
import GooglePayButton from "@google-pay/button-react";
import axios from 'axios';

const Payment = () => {
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

  /* useEffect(() => {
    setTimeout(() => {
      const localData = JSON.parse(localStorage.getItem("menu"))
      if (localData === null) {
        history.push("/");
      } else {
        gPay()
      }
    }, 800)
  }, [])*/

	  useEffect(() => {
    setTimeout(() => {
      const localData = JSON.parse(localStorage.getItem("menu"))
      if (localData === null) {
        history.push("/");
      } else {

      let totalItems = 0
      localData.data.menu.map((quentity) => {
        if(quentity.quentity > 0){
          totalItems += parseInt(quentity.quentity)
        }
      })

      if(!totalItems){
        history.push("/");
      } else {
        gPay()
      }
      }
    }, 800)
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
        <div className="container mt-4 px-4" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
          }}
          >
          <GooglePayButton
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
          >
          </GooglePayButton>
          <div
            className="d-flex justify-content-between mt-3"
            onClick={() => makePayment('paytm')}>
            <button type="submit" name="paytm"
            style={{
              alignSelf: 'center', 
              minWidth: "90px",
              width: "160px", 
              backgroundColor: "#fff",
              backgroundOrigin: "content-box",
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              border: '0px',
              borderRadius: '4px',
              boxShadow: 'rgb(60 64 67 / 30%) 0px 1px 1px 0px, rgb(60 64 67 / 15%) 0px 1px 3px 1px',
              cursor: 'pointer',
              height: '40px',
              minHeight: '40px',
              padding: '12px 24px 10px',
              backgroundImage: `url(${paytm_icon})`
            }} >
            </button>
          </div>
          <Link to="/myorders">
          <div className="d-flex justify-content-between mt-3"
            onClick={() => makePayment('cod')}>
            <button type="submit" name="paytm" 
            style={{
              alignSelf: 'center', 
              minWidth: "90px",
              width: "160px", 
              backgroundColor: "#fff",
              border: '0px',
              borderRadius: '4px',
              boxShadow: 'rgb(60 64 67 / 30%) 0px 1px 1px 0px, rgb(60 64 67 / 15%) 0px 1px 3px 1px',
              cursor: 'pointer',
              height: '40px',
              minHeight: '40px',
            }} >
              <img src={ruppes_icon} width="30px"/> 
            <strong >Cash / Card</strong>
            </button>
          </div>
	  </Link>
        </div>
        
      </div>
    </>
  );
};

export default Payment;

