import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../../context.js";
import { useHistory } from "react-router-dom";
import uploadimg from "./Capture-removebg-preview.png";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const AddMenu = () => {
      const {
    addMenu,
    closeaddMenu,
    uploadmenu,
    aboutrestro
  } = useGlobalContext();

  const [csvLink, setcsvLink] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

    const onSubmitmenu = async (data) => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);

      const formData = new FormData();
      formData.append("csv", data.csv[0]);

      const result = await axios(uploadmenu, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: formData,
      });
      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        alert(user_Session_Data.msg)
        closeaddMenu()
      } else {
        alert(user_Session_Data.msg)
      }
    } catch (e) {
      alert(e.message)
    }
  };


  useEffect(() => {
    (async () =>{
      try {
        const myToken = JSON.parse(localStorage.getItem("user"))
  
        const result = await axios.get(aboutrestro, {
          headers: { Authorization: myToken.token }
        });
        let user_Session_Data = result.data;
        if (user_Session_Data.status === 200) {
          if(user_Session_Data.data.csv){
          setcsvLink('https://app.scannmenu.com/csv/'+user_Session_Data.data.csv)
	  }
        } else {
          alert(user_Session_Data.msg)
        }
      } catch (e) {
        alert(e.message)
      }
    })()
  }, [])



    return (
        <div className={`${addMenu ? "model-popup" : "none"}`}>
          <div className="model-wrap">
            <div className="model-body">
              <div className="model-content">
                <h4 className="text-center font-weight-bold mb-3">
                  Add Menu of the Restaurant
                </h4>
                <div className="upload_logo text-center">
                  <label for="RestaurantMenu">
                    <img
                      className="mb-2"
                      src={uploadimg}
                      alt=" ADD MENU"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </label>
                  <form
                    onSubmit={handleSubmit(onSubmitmenu)}
                    // encType="multipart/form-data"
                  >
                    <input
                      className="mb-2 float-right text-secondary btn chfile"
                      type="file"
                      id="RestaurantMenu"
                      name="csv"
                      // multiple
                      required
                      // style={{fontSize:"0.7rem"}}/
                      {...register("csv")}
                    />
                    <button
                      type="submit"
                      className="Csv_button py-2 px-4 border-light"
                      style={{borderRadius:"10px"}}
                    >
                      Upload CSV
                    </button>
                    
                    <button
                      type="reset"
                      className="clos-btn"
                      onClick={closeaddMenu}
                    >
                      <FaTimes />
                    </button>
                  </form>
                  <a href={csvLink}  download>
                  <button
                      type="submit"
                      className="Csv_button py-2 px-3 border-light"
                      style={{borderRadius:"10px"}}
                    >
                      Download your Menu
                    </button>
                  </a>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default AddMenu
