import React, { useEffect, useState, useMemo, useRef } from "react";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import { AppContext, useGlobalContext } from "../../../../context.js";
import ReactToPrint from "react-to-print";
import "../../../Admin/table.css";
import { Checkbox } from "../Checkbox";
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from "react-icons/ti";
import { FaTimes } from "react-icons/fa";
import { ComponentToPrint } from "./PrintOrder";
import Loader from "react-loader-spinner";
import axios from "axios";
import Swal from "sweetalert2";

const Accept = () => {
  const {
    neworder,
    accept_order,
    closeaccept_order,
    changeorderstatus,
    todaydata,
    isSidebarOpen,
    size,
    lastValue,
    data,
  } = useGlobalContext();

  const [tableData, setTableData] = useState([]);
  const componentRef = useRef();
  const [loading, setLoading] = useState(true);

  const getNeworder = async () => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      const result = await axios(neworder, {
        headers: { Authorization: myToken.token },
      });
      if (result.status === 200) {
        todaydata();
        setTableData(result.data.data);
        setLoading(false);
      } else {
        Swal.fire({
          title: "ohh no!",
          text:'something going wrong',
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } catch (e) {
      Swal.fire({
        title: "ohh no!",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      getNeworder();
    }
  }, [lastValue]);

  const COLUMNS = [
    {
      Header: "Order ID",
      accessor: "order_id",
    },
    {
      Header: "Product Name",
      accessor: "item",
      Cell: ({ cell }) => {
        const ii = cell.row.values.item.map((data) => {
          return (
            <>
              {data.name}{" "}
              <small>
                ({data.size}, {data.quentity}x)
              </small>
              <br />
            </>
          );
        });
        return ii;
      },
    },
    {
      Header: "Amount",
      accessor: "totalprice",
      Cell: ({ cell }) => {
        return cell.row.values.totalprice;
      },
    },
    {
      Header: "Types",
      accessor: "type",
      Cell: ({ cell }) => {
        if (
          cell.row.values.type.table_number === null &&
          cell.row.values.type.room_number === null
        ) {
          return (
            <>
              <strong>Take Over</strong>
            </>
          );
        } else if (cell.row.values.type.table_number !== null) {
          return (
            <>
              <strong>
                Dining Number: {cell.row.values.type.table_number}
              </strong>
            </>
          );
        } else if (cell.row.values.type.room_number !== null) {
          return (
            <>
              <strong>Room Number: {cell.row.values.type.room_number}</strong>
            </>
          );
        }
      },
    },
    {
      Header: "Payment",
      accessor: "payment_status",
      Cell: ({ cell }) => {
        return cell.row.values.payment_status === "success" ? (
          <div className="dropdown">
            <button className="dropbtn">
              {" "}
              <strong>
                <small style={{ color: "green" }}>Success</small>
              </strong>
            </button>
          </div>
        ) : cell.row.values.payment_status === "pending" ? (
          <div className="dropdown">
            <button className="dropbtn">
              {" "}
              <strong>
                <small style={{ color: "#ea7a9a" }}>Pending</small>
              </strong>
            </button>
          </div>
        ) : (
          ""
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const datas = useMemo(() => tableData);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    nextPage,
    previousPage,
    pageOptions,
    setPageSize,
    state,
    gotoPage,
    prepareRow,
    selectedFlatRows,
  } = useTable(
    {
      columns: columns,
      data: datas,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <Checkbox {...getToggleAllRowsSelectedProps()} className="ml-2" />
            ),
            Cell: ({ row }) => (
              <Checkbox {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      });
    }
  );

  useEffect(() => {
    setPageSize(8);
  }, [page]);

  const { pageIndex } = state;

  const acceptorder = async (status) => {
    try {
      const myid = selectedFlatRows.map((order_id) => {
        return JSON.stringify(order_id.original.order_id);
      });
      var myorder = {
        orderStatus: status,
        order_id: myid,
      };

      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      const result = await axios(changeorderstatus, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: myorder,
      });
      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        getNeworder();
        todaydata();
      } else {
        Swal.fire({
          title: "ohh no!",
          text: user_Session_Data.msg,
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } catch (e) {
      Swal.fire({
        title: "ohh no!",
        text: e.message,
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };

  // if (loading) {
  //   return (
  //     <section className="section loading">
  //       <h1>Loading...</h1>
  //     </section>
  //   );
  // }

  return (
    <>
      <div className={`${accept_order ? "model-popup" : "none"}`}>
        <div className="model-wrap">
          <div className="model-body">
            <div
              className="model-content2 px-5"
              style={{ height: "max-content" }}
            >
              <div
                className={`${
                  isSidebarOpen
                    ? size <= 1100
                      ? "overflow-auto"
                      : ""
                    : size <= 1100
                    ? "overflow-auto"
                    : ""
                }`}
                style={{
                  backgroundColor: "ghostwhite",
                  border: "2px solid ghostwhite",
                  borderRadius: "20px",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                {loading ? (
                  <Loader
                    className="text-center"
                    type="BallTriangle"
                    color="#ea7a9a"
                    height={80}
                    width={80}
                  />
                ) : (
                  <table {...getTableProps()} className="scroll">
                    <thead>
                      {headerGroups.map((headerGroups) => (
                        <tr {...headerGroups.getHeaderGroupProps()}>
                          {headerGroups.headers.map((column) => (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              <small> {column.render("Header")}</small>
                              <span className="float-right">
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
                      {page.map((row, i) => {
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
                      {page.length === 0 && (
                        <tr>
                          <td colspan={6} className="text-center pt-3">
                            <h3>
                              <strong>No Orders</strong>
                            </h3>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="mt-2 float-right">
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
                        className={
                          pageIndex === i ? "active page-item" : "page-item"
                        }
                      >
                        <div
                          onClick={() => gotoPage(number)}
                          className="page-link"
                          style={{
                            cursor: "pointer",
                            padding: "9px 17px",
                            fontSize: "1rem",
                          }}
                        >
                          <small>{number + 1}</small>
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
              <div style={{ clear: "both" }}></div>
              <div className="d-flex justify-content-around my-2">
                {page.length !== 0 ? (
                  <ReactToPrint
                    trigger={() => (
                      <button
                        className="btn my_btn"
                        style={{
                          background:
                            "linear-gradient(to right, #ea7b9a, #fac7b6)",
                          color: "white",
                          borderRadius: "10px",
                          letterSpacing: "1.5px",
                          padding: "5px 20px 5px 10px",
                        }}
                        onClick={() => acceptorder("inprogress")}
                      >
                        <strong onClick={() => acceptorder("inprogress")}>
                          Accept Order
                        </strong>
                      </button>
                    )}
                    content={() => componentRef.current}
                  />
                ) : (
                  <button
                    className="btn my_btn"
                    style={{
                      background: "linear-gradient(to right, #ea7b9a, #fac7b6)",
                      color: "white",
                      borderRadius: "10px",
                      letterSpacing: "1.5px",
                      padding: "5px 20px 5px 10px",
                    }}
                  >
                    <strong>Accept Order</strong>
                  </button>
                )}
                <div style={{ display: "none" }}>
                  <ComponentToPrint
                    ref={componentRef}
                    selectedFlatRows={selectedFlatRows}
                    restroname={data}
                  />
                </div>
                <button
                  className="btn my_btn"
                  style={{
                    background: "linear-gradient(to right, #ea7b9a, #fac7b6)",
                    color: "white",
                    borderRadius: "10px",
                    letterSpacing: "1.5px",
                    padding: "5px 20px 5px 10px",
                  }}
                  onClick={() => acceptorder("cancel")}
                >
                  <strong> Cancel Order</strong>
                </button>
              </div>

              <button className="clos-btn" onClick={closeaccept_order}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accept;
