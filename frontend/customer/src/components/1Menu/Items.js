import React from "react";
import { CgClose } from "react-icons/cg";
import { BiRupee } from "react-icons/bi";
import noneveg from "./non-veg.jpg";
import veg from "./veg.png";
import { useGlobalContext } from "../../context";

const Items = ({ showInfo, filterData, setclick, setMenu, Menu }) => {
  const {
    isModalOpen,
    closeModal,
    openModal,
    increase,
    decrease,
    currentPopupId,
    popupname,
    readMore,
    ReadMore,
  } = useGlobalContext();
  return (
    <div
      onClick={() => {
        setclick(false);
        setMenu(!Menu);
      }}
    >
      {filterData.map((items, index) => {
        const { id, image, name, item, quentity, description, category, type } =
          items;
        return (
          <>
            <div style={{ padding: "0px 6px 0px 24px" }} key={index} id={type}>
              <div
                className="container mb-3 pl-2"
                style={{
                  background: "#fff",
                  borderRadius: "17px",
                  border: "1px solid ghostwhite",
                  boxShadow: "0px 20px 20px 0px rgb(0 0 0 / 10%)",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ padding: "10px 0px" }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={image}
                      alt={name}
                      style={{
                        maxWidth: "70px",
                        height: "70px",
                        borderRadius: "17px",
                        objectFit: "cover",
                        marginLeft: "-27px",
                      }}
                    />

                    <div
                      className="d-inline-flex flex-column pr-2"
                      style={{
                        marginLeft: "15px",
                        float: "right",
                        maxWidth: "400px",
                        width: "81%",
                      }}
                    >
                      <h6 style={{ fontSize: "0.8rem" }}>
                        <strong>{name}</strong>
                      </h6>
                      <p
                        style={{
                          color: "gray",
                          wordBreak: "break-word",
                          lineHeight: "0.7rem",
                          fontWeight: "400",
                          fontSize: "13px",
                          margin: "2px",
                        }}
                      >
                        {readMore.map((myDesc, index) => {
                          if (myDesc.id === id) {
                            return (
                              <small style={{ cursor: "pointer" }} key={index}>
                                {myDesc.status
                                  ? description
                                  : `${description.substring(0, 15)}...`}
                                <small
                                  onClick={() => ReadMore(myDesc.id)}
                                  style={{ color: "" }}
                                >
                                  {myDesc.status ? " showless" : " readmore"}
                                </small>
                              </small>
                            );
                          }
                        })}
                      </p>
                      <div className="d-flex align-items-center">
                        {category === "non-veg" ? (
                          <img src={noneveg} width="15px" alt="" />
                        ) : (
                          <img src={veg} width="15px" alt="" />
                        )}
                        <h6
                          className="m-0 ml-1"
                          style={{ fontSize: "14px", fontWeight: 700 }}
                        >
                          <BiRupee size={18} />
                          {item[0].price}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      className={`${
                        isModalOpen
                          ? "modal-overlay show-modal"
                          : "modal-overlay"
                      }`}
                    >
                      <div className="modal-container">
                        <h5
                          className="mt-2 px-5"
                          style={{ wordBreak: "break-word" }}
                        >
                          <strong>{`${popupname.substring(0, 18)}...`}</strong>
                        </h5>
                        <div>
                          {currentPopupId.map((ittm, index) => {
                            const { price, size, _id, sizequentity } = ittm;
                            return (
                              <>
                                <div
                                  key={index}
                                  className="d-flex justify-content-between align-items-center my-2"
                                  style={{ minWidth: "265px" }}
                                >
                                  <div className="d-flex text-center align-items-center">
                                    <h6
                                      className="text-capitalize mr-1"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {size}
                                    </h6>
                                    <h6>
                                      <BiRupee />
                                      {price}
                                    </h6>
                                  </div>
                                  <div className="d-flex text-center align-items-center ">
                                    {sizequentity <= 0 ? (
                                      <input
                                        type="button"
                                        style={{
                                          backgroundColor: "#4aa90f",
                                          borderColor: "transparent",
                                          width: "35px",
                                          height: "35px",
                                          borderRadius: "40px",
                                          fontWeight: "800",
                                          fontSize: "20px",
                                        }}
                                        className=" text-white "
                                        defaultValue="+"
                                        onClick={() => increase(_id)}
                                      />
                                    ) : (
                                      <div
                                        className="d-flex flex-column"
                                        style={{
                                          background: " #4aa90f",
                                          borderRadius: "20px",
                                        }}
                                      >
                                        <span
                                          className="text-center text-white"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => increase(_id)}
                                        >
                                          +
                                        </span>
                                        <span
                                          style={{
                                            width: "35px",
                                            color: "white",
                                            textAlign: "center",
                                            fontSize: "15px",
                                          }}
                                        >
                                          {sizequentity}
                                        </span>
                                        <span
                                          className="text-center text-white"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => decrease(_id)}
                                        >
                                          -
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                        <button
                          className="close-modal-btn"
                          onClick={closeModal}
                        >
                          <CgClose />
                        </button>
                      </div>
                    </div>
                    {item.length <= 1 ? (
                      quentity <= 0 ? (
                        <input
                          type="button"
                          style={{
                            backgroundColor: "#4aa90f",
                            borderColor: "transparent",
                            width: "35px",
                            height: "35px",
                            borderRadius: "40px",
                            fontWeight: "800",
                            fontSize: "20px",
                          }}
                          className=" text-white "
                          defaultValue="+"
                          onClick={() => increase(item[0]._id)}
                        />
                      ) : (
                        <div
                          className="d-flex flex-column"
                          style={{
                            background: " #4aa90f",
                            borderRadius: "20px",
                          }}
                        >
                          <span
                            className="text-center text-white"
                            style={{ cursor: "pointer" }}
                            onClick={() => increase(item[0]._id)}
                          >
                            +
                          </span>
                          <span
                            style={{
                              width: "35px",
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            {quentity}
                          </span>
                          <span
                            className="text-center text-white"
                            style={{ cursor: "pointer" }}
                            onClick={() => decrease(item[0]._id)}
                          >
                            -
                          </span>
                        </div>
                      )
                    ) : quentity > 0 ? (
                      <div
                        className="d-flex flex-column"
                        style={{
                          background: " #4aa90f",
                          borderRadius: "20px",
                        }}
                      >
                        <span
                          className="text-center text-white"
                          style={{ cursor: "pointer" }}
                          onClick={() => openModal(item, name)}
                        >
                          +
                        </span>
                        <span
                          onClick={() => openModal(item, name)}
                          style={{
                            width: "35px",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {quentity}
                        </span>
                        <span
                          className="text-center text-white"
                          style={{ cursor: "pointer" }}
                          onClick={() => openModal(item, name)}
                        >
                          -
                        </span>
                      </div>
                    ) : (
                      <input
                        type="button"
                        style={{
                          backgroundColor: "#4aa90f",
                          borderColor: "transparent",
                          width: "35px",
                          height: "35px",
                          borderRadius: "40px",
                          fontWeight: "800",
                          fontSize: "20px",
                        }}
                        className=" text-white "
                        defaultValue="+"
                        onClick={() => openModal(item, name)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Items;
