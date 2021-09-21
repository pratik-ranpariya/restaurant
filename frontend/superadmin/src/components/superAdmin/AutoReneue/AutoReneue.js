import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from "react-icons/ti";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useGlobalContext } from "../../../context.js";
import "../table.css";
import Swal from "sweetalert2";

const AutoReneue = () => {
  const { isSidebarOpen, generate_receipt, generate_receipt_table, size } =
    useGlobalContext();

  const [addRestaurant, setAddRestaurant] = useState(false);
  const [popupData, setPopupData] = useState({
    address: "",
    city: "",
    email: "",
    mobile: 0,
    name: "",
    restaurant_id: ""
  })

  const openaddRestaurant = () => {
    setAddRestaurant(true);
  };
  const closeaddRestaurant = () => {
    setAddRestaurant(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.address = popupData.address
    data.city = popupData.city
    data.email = popupData.email
    data.mobile = popupData.mobile
    data.name = popupData.name
    data.restaurant_id = popupData.restaurant_id
    // try {
    //   const getToken = localStorage.getItem("user");
    //   var myToken = JSON.parse(getToken);

    //   const formData = new FormData();
    //   formData.append("name", data.name);

    //   const result = await axios(uploadnamelogo, {
    //     headers: { Authorization: myToken.token },
    //     method: "POST",
    //     data: formData,
    //   });
    //   let user_Session_Data = result.data;
    //   if (user_Session_Data.status === 200) {
    //     alert(user_Session_Data.msg);
    //     closeaddRestaurant()
    //   } else {
    //     alert(user_Session_Data.msg);
    //   }
    // } catch (error) {
    //   alert(errors);
    // }

    try {
      const apiCall = await axios.get(generate_receipt + '?' + new URLSearchParams(data).toString(), {
        headers: { Authorization: myToken.token }
      })
      if (apiCall.data.status === 200) {
        Swal.fire({
          title: "Done!",
          text: apiCall.data.msg,
          icon: "success",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } catch (e) {
      Swal.fire({
        title: "oops",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }

  };

  


  const [tableData, setTableData] = useState([]);

  const getToken = localStorage.getItem("user");
  var myToken = JSON.parse(getToken);

  const stateChange = async (data) => {
    setPopupData(data)
    openaddRestaurant(true)
    // console.log(data);

    //   var querys = "?restaurant_id=" + restaurant_id;

    //   console.log(querys);
    //   const apiCall = await axios.get(generate_receipt + querys, {
    //     headers: { Authorization: myToken.token },
    //   });
    //   console.log(apiCall.data);

    //   if (apiCall.data.status === 200) {
    //     // callApis();
    //     alert(apiCall.data.msg);
    //   } else {
    //   }
  }

  const callApis = async () => {
    try {
      const result = await axios(generate_receipt_table, {
        headers: { Authorization: myToken.token },
      })
      if (result.status === 200) {
        setTableData(result.data.data);
      }
    } catch (e) {
      Swal.fire({
        title: "Ohh no!",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  }

  useEffect(() => {
    callApis();
  }, [generate_receipt_table]);

  const COLUMNS = [
    {
      Header: "Resturent Name",
      accessor: "name",
    },
    {
      Header: "Location",
      accessor: "address",
    },
    {
      Header: "City",
      accessor: "city",
    },
    {
      Header: "Email ID",
      accessor: "email",
    },
    {
      Header: "Phone Number",
      accessor: "mobile",
    },
    {
      Header: "Details",
      accessor: "restaurant_id",
      Cell: ({ cell }) => {
        return (
          <div style={{ borderBottom: "none" }}>
            <button
              className="More_Details my-2"
              // onClick={() =>  setAddRestaurant(true)
              onClick={() => stateChange(cell.row.values)
                // stateChange(cell.row.values.restaurant_id)
              }
            >
              <small>Genrate&nbsp;Recipt</small>
            </button>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => tableData);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    nextPage,
    previousPage,
    pageOptions,
    state,
    gotoPage,
    prepareRow,
    selectedFlatRows,
  } = useTable(
    {
      columns: columns,
      data: data,
    },
    useSortBy,
    usePagination,
    useRowSelect
  );
  const { pageIndex, pageSize } = state;

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}
      >
        <div
          className={`${isSidebarOpen ? (size <= 1100 ? "overflow-auto" : "") : ""
            }`}
        >
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroups) => (
                <tr {...headerGroups.getHeaderGroupProps()}>
                  {headerGroups.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      <small> {column.render("Header")}</small>
                      <span className="float-right" style={{marginRight:"10px"}}>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TiArrowSortedUp />
                          ) : (
                            <TiArrowSortedDown />
                          )
                        ) : (
                          <TiArrowUnsorted />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>
                          {" "}
                          <small> {cell.render("Cell")}</small>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          className="d-flex justify-content-between pl-5 mt-2"
          style={{ maxWidth: "75vw" }}
        >
          {size >= 450 ? (
            <h6 className="">
              <small>
                {" "}
                Showing {rows.length === 0
                  ? 0
                  : pageSize * pageIndex + 1} to{" "}
                {pageSize * (pageIndex + 1) <= rows.length - 10
                  ? pageSize * (pageIndex + 1)
                  : rows.length}{" "}
                of {rows.length} entries
              </small>
            </h6>
          ) : (
            ""
          )}
          <ul className="pagination">
            <li>
              <button
                onClick={() => previousPage()}
                style={{
                  color: "white",
                  backgroundColor: "#ea7a9a",
                  borderRadius: "10px",
                  outline: "none !important",
                  boxShadow: "none",
                  cursor: "pointer",
                  padding: "13px",
                  border: "none",
                  fontSize: "0.8rem",
                  marginRight: "0.2rem",
                }}
              >
                Previous
              </button>
            </li>
            {pageOptions.map((number, i) => (
              <div className="page-list">
                <li
                  key={number}
                  className={pageIndex === i ? "active page-item" : "page-item"}
                >
                  <div
                    onClick={() => gotoPage(number)}
                    // href="#"
                    className="page-link"
                    style={{
                      cursor: "pointer",
                      padding: "9px 17px",
                      fontSize: "1rem",
                    }}
                  >
                    {number + 1}
                  </div>
                </li>
              </div>
            ))}
            <li>
              <button
                onClick={() => nextPage()}
                style={{
                  color: "white",
                  backgroundColor: "#ea7a9a",
                  borderRadius: "10px",
                  outline: "none !important",
                  boxShadow: "none",
                  cursor: "pointer",
                  padding: "13px",
                  border: "none",
                  fontSize: "0.8rem",
                  marginLeft: "0.2rem",
                }}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
        <div className={`${addRestaurant ? "model-popup" : "none"}`}>
          <div className="model-wrap">
            <div className="model-body">
              <div className="model-content" style={{maxWidth: "650px"}}>
                <div className="input_popup">
                
                  <h5 className="text-center mb-5">Send Receipt</h5>
                  <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <table style={{ minWidth: 'unset', textAlign: 'center', margin: "0 auto"}}>
                        <tr>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>
                            Name :
                          </td>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>
                          {popupData.name}
                          </td>
                        </tr>

                        <tr>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>Address :
                          </td>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>
                          {popupData.address}
                          </td>
                        </tr>

                        <tr>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>City :
                          </td>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>
                          {popupData.city}
                          </td>
                        </tr>

                        <tr>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>Email :
                          </td>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>
                          {popupData.email}
                          </td>
                        </tr>

                        <tr>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>Mobile :
                          </td>
                          <td style={{textAlign: 'left', padding:"6px 25px"}}>
                          {popupData.mobile}
                          </td>
                        </tr>

                        <tr>
                          <td className="text-left pt-5">
                            <label >Start Date</label>
                            <input className="form-control" type="date" name="startdate" onBlur={(e) => (e.currentTarget.type = "date")} {...register("start_date", { required: true })}/>
                          </td>
                          <td className="text-left pt-5">
                          <label >End Date</label>
                            <input className="form-control" type="date" name="enddate" onBlur={(e) => (e.currentTarget.type = "date")} {...register("end_date", { required: true })}/>
                          </td>
                        </tr>

                        <tr>
                          <td className="text-left">
                            <label >Select Plan</label>
                            <select className="form-control" {...register("subcription_type", { required: true })}>
                              <option hidden disabled selected>Subcription Plans</option>
                              <option>takeAway</option>
                              <option>DiningTable</option>
                              <option>Hotel</option>
                            </select>
                          </td>
                          <td className="text-left">
                            <label >Amount</label><br />
                            <input type="number" name="amount" className="form-control" {...register("price", { required: true })} />
                          </td>
                        </tr>


                      </table>
                      <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <button
                          className="col-5 col-lg-4 col-md-4  col-sm-4 Update_button border-transperant py-2 text-center"
                          type="submit">
                          Generate
                        </button>
                      </div>
                    </div>
                    
                  </form>
                 
                  <button className="clos-btn" onClick={closeaddRestaurant}>
                    <FaTimes />
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code>
      </pre> */}
      </div>
    </>
  );
};

export default AutoReneue;
