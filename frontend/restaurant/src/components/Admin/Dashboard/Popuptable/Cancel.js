import React, { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import { AppContext, useGlobalContext } from "../../../../context.js";
import "../../../Admin/table.css";
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from "react-icons/ti";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Cancel = () => {
  const { cancel_order, closecancel_order, ordersTable, isSidebarOpen, size } =
    useGlobalContext();

  const [tableData, setTableData] = useState([]);

  var selectDate = `${new Date().getFullYear()}-${
    JSON.stringify(new Date().getMonth() + 1).length === 1
      ? `0${new Date().getMonth() + 1}`
      : new Date().getMonth() + 1
  }-${
    JSON.stringify(new Date().getDate()).length === 1
      ? `0${new Date().getDate()}`
      : new Date().getDate()
  }`;

  var url = `?status=cancel&date=${selectDate}`;

  const orderTable = async () => {
    try {
      const getToken = localStorage.getItem("user");
      var myToken = JSON.parse(getToken);
      const result = await axios(ordersTable + url, {
        headers: { Authorization: myToken.token },
      });
      if (result.status === 200) {
        setTableData(result.data.data);
      } else {
        Swal.fire({
          title: "ohh no!",
          text: 'something going wrong',
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
  }, [selectDate]);

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
                Dining No: {cell.row.values.type.table_number}
              </strong>
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
    setPageSize,
    state,
    gotoPage,
    prepareRow,
  } = useTable(
    {
      columns: columns,
      data: data,
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    setPageSize(8);
  }, [page]);

  const { pageIndex } = state;

  return (
    <>
      <div className={`${cancel_order ? "model-popup" : "none"}`}>
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
              </div>
              <div className="mt-2 float-right">
                <ul className="pagination">
                  <li>
                    <button
                      onClick={() => previousPage()}
                      style={{
                        color: "white",
                        backgroundColor: "#ea7a9a",
                        borderRadius: "15px",
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
                        borderRadius: "15px",
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
              <button className="clos-btn" onClick={closecancel_order}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cancel;
