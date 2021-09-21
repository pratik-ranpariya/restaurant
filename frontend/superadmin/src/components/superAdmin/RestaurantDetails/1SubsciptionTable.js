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
import { useGlobalContext } from "../../../context";
import "../table.css";
import Swal from "sweetalert2";

const AutoReneue = (id) => {
  const { isSidebarOpen, subcriptionHistory, size } =useGlobalContext()

  const [tableData, setTableData] = useState([]);

  const getToken = localStorage.getItem("user");
  var myToken = JSON.parse(getToken);

  const callApis = async () => {
      try {
          const result = await axios.get(subcriptionHistory + "?restaurant_id=" + id.id,
              {
                headers: { Authorization: myToken.token },
              }
            );
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
  };

  useEffect(() => {
    callApis();
  }, []);

  const COLUMNS = [
    {
      Header: "Start Date",
      accessor: "start_date",
    },
    {
      Header: "End Date",
      accessor: "end_date",
    },
    {
      Header: "Type",
      accessor: "subcription_type",
    },
    {
      Header: "Amount",
      accessor: "price",
    },
    {
      Header: "Status",
      accessor: "action",
      Cell: ({ cell }) => {
        return (
          <>
            <p style={{
                  color:
                  cell.row.values.action === "running"
                      ? "#ea7a9a"
                      : cell.row.values.action === "accepted"
                      ? "green"
                      : cell.row.values.action === "complated"
                      ? "green"
                      : "red",
                  lineHeight: "1.3rem",
                  fontSize: '14px',
                  textAlign: 'left',
                  margin:"0px",
                  padding:"10px 0px"
                }}>
                    
                    {cell.row.values.action === 'cancel' ? 'canceled' : cell.row.values.action}
            </p>
          </>
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
      style={{minHeight: '0px'}}  className={`${isSidebarOpen ? "p-4" : "p-4"} `}
      >
        <div
          className={`${isSidebarOpen ? (size <= 1100 ? "overflow-auto" : "") : ""
            }`}
        >
        <h3>
            Subcription History
        </h3>

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
      </div>
    </>
  );
};

export default AutoReneue;
