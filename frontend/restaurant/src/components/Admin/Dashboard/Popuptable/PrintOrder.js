import React, { Component } from "react";
import { BiRupee } from "react-icons/bi";

export class ComponentToPrint extends React.PureComponent {
  render() {
    // const myid = this.props.selectedFlatRows.map((order_id) => {
    //   return JSON.stringify(order_id.original);
    // });
    // console.log(this.props.restroname.name);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <>
        <div className="container">
          {this.props.selectedFlatRows.map((data) => {
            const { order_id, totalprice, day, month, year, item } =
              data.original;
            return (
              <>
                <div className="container pt-5">
                  <div className="d-flex justify-content-center">
                    <div style={{ wordWrap: "break-word" }}>
                      <h3>{this.props.restroname.name}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h6> Order_id: {order_id}</h6>
                  </div>
                  <div>
                    <h6>
                      {months[month - 1]} {day} {year}
                    </h6>
                  </div>
                  <div>
                    <h6>
                      {new Date().getHours()} : {new Date().getMinutes()}
                    </h6>
                  </div>
                  <div className="row mt-4">
                    {item.map((items) => {
                      const {
                        id,
                        image,
                        name,
                        quentity,
                        category,
                        size,
                        price,
                        sizeid,
                      } = items;
                      return (
                        <>
                          <hr className="my-2" />
                          <div className="col-8">
                            <h6 style={{ fontSize: "0.8rem" }}>
                              <strong>
                                {name}
                                <small>
                                  ({size}) x{quentity}
                                </small>
                              </strong>
                            </h6>
                          </div>
                          <div className="col-4 text-right">
                            <h6
                              className="m-0 ml-1"
                              style={{ fontSize: "14px", fontWeight: 700 }}
                            >
                              <BiRupee size={18} />
                              {price}
                            </h6>
                          </div>
                        </>
                      );
                    })}
                  </div>
                  {/* <div className="row mt-2">
                    <div className="col-8">
                      <h6>
                        <strong>GST Charge</strong>
                      </h6>
                    </div>
                    <div className="col-4 text-right">
                      <h6>
                        <strong>
                          {(
                            totalprice +
                            (totalprice * 18) / 100 -
                            totalprice
                          ).toFixed(2)}
                        </strong>
                      </h6>
                    </div>
                  </div> */}
                  <hr className="my-2" />
                  <div className="row">
                    <div className="col-8">
                      <h5>
                        <strong>To Pay</strong>
                      </h5>
                    </div>
                    <div className="col-4 text-right font-weight-bold ">
                      <h5>
                        <strong>{totalprice}</strong>
                      </h5>
                    </div>
                  </div>
                  <hr className="my-2" />
                </div>
              </>
            );
          })}
        </div>
      </>
    );
  }
}
