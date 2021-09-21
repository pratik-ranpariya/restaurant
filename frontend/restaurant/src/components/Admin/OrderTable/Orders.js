import React, { useState, useMemo, useEffect } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useRowSelect,
} from "react-table";
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from "react-icons/ti";
import DatePicker from "react-date-picker";
import { GlobalFilter } from "./GlobalFilter.js";
import { BiChevronDown, BiDotsVerticalRounded, BiRupee } from "react-icons/bi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsDownload } from "react-icons/bs";
import { useGlobalContext } from "../../../context.js";
import Loader from "react-loader-spinner";
import axios from "axios";
import CsvDownloader from "react-csv-downloader";
import "../table.css";
import Swal from 'sweetalert2'

const Orders = () => {
  const {
    isSidebarOpen,
    ordersTable,
    changeorderstatus,
    changepaymentstatus,
    size,
    allOrders,
    lastValue,
  } = useGlobalContext();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showStatus, setShowStatus] = useState(false);

  const [SelectedDate, setSelectedDate] = useState(new Date());
  const [statusChange, setstatusChange] = useState("ALL Status");

  var selectDate = `${SelectedDate.getFullYear()}-${
    JSON.stringify(SelectedDate.getMonth() + 1).length === 1
      ? `0${SelectedDate.getMonth() + 1}`
      : SelectedDate.getMonth() + 1
  }-${
    JSON.stringify(SelectedDate.getDate()).length === 1
      ? `0${SelectedDate.getDate()}`
      : SelectedDate.getDate()
  }`;

  var url = `?status=${
    statusChange === "All Status"
      ? "all"
      : statusChange === "New Order"
      ? "pending"
      : statusChange === "On Delivery"
      ? "inprogress"
      : statusChange === "Delivered"
      ? "success"
      : statusChange === "Cancel"
      ? "cancel"
      : "all"
  }&date=${selectDate}`;

  const orderTable = async () => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      const result = await axios(ordersTable + url, {
        headers: { Authorization: myToken.token },
      });
      if (result.status === 200) {
        setTableData(result.data.data);
        setLoading(false);
      } else {
        Swal.fire({
          title: "ohh no!",
          text: "something went wrong!",
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
    orderTable();
  }, [url, lastValue]);

  const CSVdata = async () => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      const result = await axios(allOrders, {
        headers: { Authorization: myToken.token },
        method: "POST",
      });
      if (result.status === 200) {
        return result.data.data;
      } else {
        Swal.fire({
          title: "ohh no!",
          text: "something went wrong!",
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    } catch (e) {
      Swal.fire({
        title: "ohh no!",
        text: "something went wrong!",
        icon: "error",
        confirmButtonColor: 'rgb(234, 122, 154)'
      })
    }
  };

  const orderstatuschange = async (id, status) => {
    try {
      var myorder = {
        orderStatus: status,
        order_id: [id],
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
        orderTable();
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

  const pymentstatus = async (id, status) => {
    try {
      var mypayment = {
        paymentStatus: status,
        order_id: [id],
      };
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      const result = await axios(changepaymentstatus, {
        headers: { Authorization: myToken.token },
        method: "POST",
        data: mypayment,
      });
      let user_Session_Data = result.data;
      if (user_Session_Data.status === 200) {
        orderTable();
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

  const COLUMNS = [
    {
      Header: "Order ID",
      accessor: "order_id",
    },
    {
      Header: "Time",
      accessor: "start_time",
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
      Header: "Instructions",
      accessor: "desc",
      Cell: ({ cell }) => {
        return (
          <div style={{ maxWidth: "150px", wordWrap: "break-word" }}>
            <small>{cell.row.values.desc}</small>
          </div>
        );
      },
    },
    {
      Header: "Amount",
      accessor: "totalprice",
      Cell: ({ cell }) => {
        return (
          <>
            <BiRupee size={14} /> {cell.row.values.totalprice}
          </>
        );
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
              <strong>Take Away</strong>
            </>
          );
        } else if (cell.row.values.type.table_number !== null) {
          return (
            <>
              <strong>Table No: {cell.row.values.type.table_number}</strong>
            </>
          );
        } else if (cell.row.values.type.room_number !== null) {
          return (
            <>
              <strong>Room No: {cell.row.values.type.room_number}</strong>
            </>
          );
        }
      },
    },
    {
      Header: "Order Status",
      accessor: "status",
      Cell: ({ cell }) => {
        return cell.row.values.status === "success" ? (
          <>
            <div className="dropdown float-right">
              <button className="dropbtn">
                <strong>
                  <BiDotsVerticalRounded />
                </strong>
              </button>
              <div className="dropdown-content">
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "success")
                  }
                >
                  Delivered
                </span>
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "inprogress")
                  }
                >
                  On Delivery
                </span>
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "cancel")
                  }
                >
                  Cancel
                </span>
              </div>
            </div>
            <div className="mt-1">
              <small style={{ color: "green", fontSize: "14px" }}>
                Delivered
              </small>
            </div>
          </>
        ) : cell.row.values.status === "pending" ? (
          <>
            <div className="dropdown float-right">
              <button className="dropbtn">
                <strong>
                  <BiDotsVerticalRounded />
                </strong>
              </button>
              <div className="dropdown-content">
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "success")
                  }
                >
                  Delivered
                </span>
                {/* <span
                onClick={() =>
                  orderstatuschange(cell.row.values.order_id, "pending")
                }
              >
                New Order
              </span> */}
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "inprogress")
                  }
                >
                  On Delivery
                </span>
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "cancel")
                  }
                >
                  Cancel
                </span>
              </div>
            </div>
            <div className="mt-1">
              <small style={{ color: "#ea7a9a", fontSize: "14px" }}>
                New Order
              </small>
            </div>
          </>
        ) : cell.row.values.status === "inprogress" ? (
          <>
            <div className="dropdown float-right">
              <button className="dropbtn">
                <strong>
                  <BiDotsVerticalRounded />
                </strong>
              </button>
              <div className="dropdown-content">
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "success")
                  }
                >
                  Delivered
                </span>
                {/* <span
                onClick={() =>
                  orderstatuschange(cell.row.values.order_id, "pending")
                }
              >
                New Order
              </span> */}
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "inprogress")
                  }
                >
                  On Delivery
                </span>
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "cancel")
                  }
                >
                  Cancel
                </span>
              </div>
            </div>
            <div className="mt-1">
              <small style={{ color: "#ea7a9a", fontSize: "14px" }}>
                On Delivery
              </small>
            </div>
          </>
        ) : cell.row.values.status === "cancel" ? (
          <>
            <div className="dropdown float-right">
              <button className="dropbtn">
                <strong>
                  <BiDotsVerticalRounded />
                </strong>
              </button>
              <div className="dropdown-content">
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "success")
                  }
                >
                  Delivered
                </span>
                {/* <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "pending")
                  }
                >
                  New Order
                </span> */}
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "inprogress")
                  }
                >
                  On Delivery
                </span>
                <span
                  onClick={() =>
                    orderstatuschange(cell.row.values.order_id, "cancel")
                  }
                >
                  Cancel
                </span>
              </div>
            </div>
            <div className="mt-1">
              <small style={{ color: "Black", fontSize: "14px" }}>Cancel</small>
            </div>
          </>
        ) : (
          ""
        );
      },
    },
    {
      Header: "Payment",
      accessor: "payment_status",
      Cell: ({ cell }) => {
        return cell.row.values.payment_status === "success" ? (
<>
          <div className="dropdown float-right">
            <button className="dropbtn">
              <strong>
                <BiDotsVerticalRounded style={{ color: "green" }} />
              </strong>
            </button>
            <div className="dropdown-content">
              <span
                onClick={() =>
                  pymentstatus(cell.row.values.order_id, "success")
                }
              >
                Success
              </span>
              <span
                onClick={() =>
                  pymentstatus(cell.row.values.order_id, "pending")
                }
              >
                Pending
              </span>
            </div>
          </div>
          <div className="mt-1">
          <small style={{ color: "green", fontSize: "14px" }}>
          Success
          </small>
        </div>
        </>
        ) : cell.row.values.payment_status === "pending" ? (
          <>
          <div className="dropdown float-right">
            <button className="dropbtn">
              <strong>
                {/* <small style={{ color: "#ea7a9a" }}>Pending</small> */}
                <BiDotsVerticalRounded />
              </strong>
            </button>
            <div className="dropdown-content">
              <span
                onClick={() =>
                  pymentstatus(cell.row.values.order_id, "success")
                }
              >
                Success
              </span>
              <span
                onClick={() =>
                  pymentstatus(cell.row.values.order_id, "pending")
                }
              >
                Pending
              </span>
              {/* <span
                onClick={() =>
                  orderstatuschange(cell.row.values.order_id, "cancel")
                }
              >
                Cancel
              </span> */}
            </div>
          </div>
          <div className="mt-1">
          <small style={{ color: "#ea7a9a", fontSize: "14px" }}>
          Pending
          </small>
        </div>
        </>
        ) : (
          ""
        );
      },
    },
  ];

  const columnss = [
    {
      id: "orderId",
      displayName: "orderId",
    },
    {
      id: "date",
      displayName: "date",
    },
    {
      id: "products",
      displayName: "products",
    },
    {
      id: "amount",
      displayName: "amount",
    },
    {
      id: "types",
      displayName: "types",
    },
    {
      id: "orderStatus",
      displayName: "orderStatus",
    },
    {
      id: "payment",
      displayName: "payment",
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
    setGlobalFilter,
  } = useTable(
    {
      columns: columns,
      data: data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  // if (loading) {
  //   return (
  //     <section className="section loading">
  //       <h1>Loading...</h1>
  //     </section>
  //   );
  // }
  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}
      >
        <div>
          <div
            className={`${
              size <= 730
                ? "d-flex flex-column justify-content-center align-items-center mb-3"
                : "d-flex float-right align-items-center mb-3 pr-5"
            }`}
          >
            <div
              // className="dropdownS mr-2"
              className={`${size <= 730 ? "dropdownS mb-2" : "dropdownS mr-2"}`}
              onMouseLeave={() => setShowStatus(false)}
            >
              <CsvDownloader
                className="dropbtnS"
                filename="orders"
                extension=".csv"
                separator=","
                wrapColumnChar='"'
                columns={columnss}
                datas={() => CSVdata()}
                text="DOWNLOAD"
              >
                <strong
                  style={{
                    letterSpacing: "0.2rem",
                  }}
                >
                  <BsDownload size={15} className="mr-2" /> Download CSV
                </strong>
              </CsvDownloader>
            </div>
            <div
              className={`${size <= 730 ? "dropdownS mb-2" : "dropdownS"}`}
              onMouseLeave={() => setShowStatus(false)}
            >
              <button className="dropbtnS" onClick={() => setShowStatus(true)}>
                {" "}
                <strong
                  style={{
                    letterSpacing: "0.2rem",
                  }}
                >
                  <AiOutlineThunderbolt size={15} /> &nbsp; {statusChange}{" "}
                  &nbsp; <BiChevronDown size={18} />
                </strong>
              </button>
              <div
                className={`${showStatus ? "dropdown-contentS" : "none"}`}
                onClick={() => setShowStatus(false)}
              >
                <a href="#" onClick={() => setstatusChange("Delivered")}>
                  <small>Delivered</small>
                </a>
                <a href="#" onClick={() => setstatusChange("New Order")}>
                  <small> New Order</small>
                </a>
                <a href="#" onClick={() => setstatusChange("On Delivery")}>
                  <small>On Delivery</small>
                </a>
                <a href="#" onClick={() => setstatusChange("Cancel")}>
                  <small>Cancel</small>
                </a>
                <a href="#" onClick={() => setstatusChange("All Status")}>
                  <small>ALL Status</small>
                </a>
              </div>
            </div>
            <div>
              <div
                // className="ml-2"
                className={`${size <= 730 ? "mb-2" : " ml-2"}`}
              >
                <button
                  style={{
                    letterSpacing: "0.1rem",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    color: "#ec859e",
                    border: "none",
                    padding: "5px",
                    borderRadius: "10px",
                    // padding: "14px",
                  }}
                >
                  <small>
                    <DatePicker
                      nativeInputAriaLabel={Date}
                      // selected={SelectedDate}
                      selected={null}
                      value={SelectedDate}
                      onChange={(date) => setSelectedDate(date)}
                    />
                  </small>
                </button>
              </div>
            </div>
          </div>
          <div>
            <GlobalFilter filter={globalFilter} setfilter={setGlobalFilter} />
          </div>
          <div style={{ clear: "both" }}></div>
          <div
            // className={`${
            //   isSidebarOpen ? "" : size <= 450 ? "overflow-auto" : ""
            // }`}
            className={`${
              isSidebarOpen
                ? size <= 1100
                  ? "overflow-auto"
                  : ""
                : size <= 1100
                ? "overflow-auto"
                : ""
            }`}
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
              <table {...getTableProps()}>
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
                          <span className="pl-5">
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
                      <td colspan={7} style={{border: 'none'}} className="text-center pt-3">
                        <h3>
                          <strong>No Data Found</strong>
                        </h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div
            className="d-flex justify-content-between overflow-auto pl-4 mt-2"
            style={{ width: "100%" }}
          >
            {size >= 450 ? (
              <h6 className="mt-2">
                <small>
                  {" "}
                  Showing {rows.length === 0
                    ? 0
                    : pageSize * pageIndex + 1} to{" "}
                  {pageSize * (pageIndex + 1) <= rows.length - 10
                    ? pageSize * (pageIndex + 1)
                    : rows.length}{" "}
                  of {rows.length} Entries
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
        </div>
      </div>
    </>
  );
};

export default Orders;
