import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AppContext, useGlobalContext } from "../../../context.js";
import Select from 'react-select';
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const AddSubAdmin = () => {
  const history = useHistory();

  const {getRestoSubcription, isSidebarOpen, Add_Subscription, restaurants_details_table, size } =
    useGlobalContext();

  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
const [restoPlan, setrestoPlan] = useState('')
  const [ariaFocusMessage, setAriaFocusMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const style = {
    blockquote: {
      fontStyle: 'italic',
      fontSize: '.75rem',
      margin: '1rem 0',
    },
    label: {
      fontSize: '.75rem',
      fontWeight: 'bold',
      lineHeight: 2,
    },
  };

  const onFocus = ({ focused, isDisabled }) => {
    const msg = `You are currently focused on option ${focused.label}${isDisabled ? ', disabled' : ''
      }`;
    setAriaFocusMessage(msg);
    return msg;
  };

  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);

  useEffect(() => {
    (async () => {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      const result = await axios(restaurants_details_table, {
        headers: { Authorization: myToken.token },
      });
      if (result.status === 200) {
        setData(result.data.data);
        setLoading(false);
      }
    })();
  }, [restaurants_details_table]);


   useEffect(() => {
    (async () => {
      if(selectedOption){
        const getToken = localStorage.getItem("user");
        var myToken = JSON.parse(getToken);
        const result = await axios.get(getRestoSubcription + '?_id=' + selectedOption.value, {
          headers: { Authorization: myToken.token },
        });
        console.log(result.data.data.restaurant_type.restaurant_type);
        if (result.status === 200) {
          setrestoPlan(result.data.data.restaurant_type.restaurant_type)
        }
      }
    })()
  }, [selectedOption])

  const bbb = []
  Data.map((data, i) => {

    bbb.push({ value: data._id.toString(), label: data.name + ' (' + data.address + ')' })

    // label.push(data.name + ' - ' + data.address)
    // value.push(data._id)
  })

  console.log(bbb);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data, e) => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      data.restoid = selectedOption.value

      const result = await axios(Add_Subscription, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: data,
      });

      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        Swal.fire({
          title: "Done!",
          text: user_Session_Data.msg,
          icon: "success",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      } else {
        Swal.fire({
          title: "ohh no!",
          text: user_Session_Data.msg,
          icon: "warning",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } catch (e) {
      Swal.fire({
        title: "Oops!",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };

  return (
    <div className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}>
      <div className="" style={{ padding: "3%", maxWidth: "50rem" }}>
        <div
          className="con1"
          style={{ boxSizing: "border-box", padding: "0%", margin: "0%" }}
        >
          <div style={{ padding: "40px" }}>
            <h2 className="m-0">
              <small>Restaurant Subscription</small>
            </h2>
            <div className="mb-4" style={{ position: "relative" }}>
              <hr
                width="100%"
                color="ghostwhite"
                style={{ position: "absolute", border: "none", height: "3px" }}
              />
              <hr
                width="65%"
                color="#ea7a9a"
                style={{ position: "absolute", border: "none", height: "3px" }}
              />
            </div>
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlfor="restoid">Restaurant Name</label>

                {/* {!!ariaFocusMessage && !!isMenuOpen && (
                  <blockquote style={style.blockquote}>"{ariaFocusMessage}"</blockquote>
                )} */}

                <Select
                  defaultValue={selectedOption}
                  onChange={setSelectedOption}
                  options={bbb}
                  // {...register("restoid", { required: true })}
                />

                {/* <select 
                  className="form-control"
                  id="exampleInputName"
                  name="restoid"
                  style={{ backgroundColor: "ghostwhite", outline: "none" }}
                  required
                  {...register("restoid", { required: true })}
                >
                  <option value="" selected disabled hidden>
                    Choose...
                  </option>
                  {Data.map((data) => {
                    return <option value={data._id}>{data.name}</option>;
                  })}
                </select> */}
              </div>
              <div className="form-group">
                <label htmlfor="plan">Choose Plans</label>
                <select
                  className="form-control"
                  id="exampleInputName"
                  name="plan"
                  style={{ backgroundColor: "ghostwhite", outline: "none" }}
                  required
                  {...register("subcription_type", { required: true })}
                >
                  <option value="" selected disabled hidden>
                    Choose...
                  </option>
	  {/* <option value="take_away">Take Away</option>;
                  <option value="dining_table">Dining</option>;
                  <option value="hotel">Hotel</option>; */}

	                  {restoPlan === 'take_away' ? <option value="take_away" selected>Take Away</option> : <option value="take_away">Take Away</option>}
                  {restoPlan === 'dining_table' ? <option value="dining_table" selected>Dining</option> : <option value="dining_table">Dining</option>}
                  {restoPlan === 'hotel' ? <option value="hotel" selected>Hotel</option> : <option value="hotel">Hotel</option>}
                </select>
              </div>
              <div className="form-group">
                <label htmlfor="plansize">Plan Size</label>
                <select
                  className="form-control"
                  id="exampleInputName"
                  name="plansize"
                  style={{ backgroundColor: "ghostwhite", outline: "none" }}
                  required
                  {...register("plansize", { required: true })}
                >
                  <option value="" selected disabled hidden>
                    Choose...
                  </option>
                  <option value="3">3 Months</option>;
                  <option value="6">6 Months</option>;
                  <option value="12">12 Months</option>;
                </select>
              </div>
              <div className="form-group">
                <label htmlfor="paytype">Payment Type</label>
                <select
                  className="form-control"
                  id="exampleInputName"
                  name="paytype"
                  style={{ backgroundColor: "ghostwhite", outline: "none" }}
                  required
                  {...register("payment_type", { required: true })}
                >
                  <option value="" selected disabled hidden>
                    Choose...
                  </option>
                  <option value="razorpay">Razorpay</option>;
                  <option value="cash">Cheque or Cash</option>;
                </select>
              </div>
              <div className="form-group mb-5 mt-2">
                <button
                  type="submit"
                  className="btn btn-grad"
                  style={{ float: "right" }}
                >
                  <h3 className="m-0">
                    <small>Update</small>
                  </h3>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubAdmin;
