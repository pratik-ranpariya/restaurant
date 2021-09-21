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
import Loader from "react-loader-spinner";
import { useGlobalContext } from "../../../context.js";
import { GlobalFilter } from "../RestaurantDetails/GlobalFilter";
import axios from "axios";
import "../table.css";
import Swal from "sweetalert2";

const Status = () => {
  const { isSidebarOpen, restaurant_status_table, size } = useGlobalContext();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = localStorage.getItem("user");
  var myToken = JSON.parse(getToken);

  const callApis = async () => {
    try {
      const result = await axios(restaurant_status_table, {
        headers: { Authorization: myToken.token },
      });
      if (result.status === 200) {
        setTableData(result.data.data);
        setLoading(false);
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
  }, [restaurant_status_table]);

  const COLUMNS = [
    {
      Header: "Resturent Name",
      accessor: "name",
    },
    {
      Header: "Location",
      accessor: "Location",
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
      accessor: "Phone_Number",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell }) => {
        return cell.row.values.status === "renue" ? (
          <button
            style={{
              background: "linear-gradient(to right, #ea7b9a, #fac7b6)",
              padding: "8px 10px",
              margin: "8px 0px",
              textAlign: "center",
              color: "white",
              textTransform: "capitalize",
              border: "transparent",
              borderRadius: "10px",
              width:"70px"
            }}
          >
            {cell.row.values.status}
          </button>
        ) : cell.row.values.status === "active" ? (
          <button
            style={{
              background: "green",
              padding: "8px 10px",
              margin: "8px 0px",
              textAlign: "center",
              color: "white",
              textTransform: "capitalize",
              border: "transparent",
              borderRadius: "10px",
               width:"70px"
            }}
          >
            {cell.row.values.status}
          </button>
        ) : cell.row.values.status === "inactive" ? (
          <button
            style={{
              background: "black",
              padding: "8px 10px",
              margin: "8px 0px",
              textAlign: "center",
              color: "white",
              textTransform: "capitalize",
              border: "transparent",
              borderRadius: "10px",
              width:"70px"
            }}
          >
            {cell.row.values.status}
          </button>
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

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}
      >
        <GlobalFilter filter={globalFilter} setfilter={setGlobalFilter} />
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
            {loading ? (
              <div style={{ width: "370%", overflow: "none" }}>
                {" "}
                <Loader
                  className="text-center"
                  type="BallTriangle"
                  color="#ea7a9a"
                  height={80}
                  width={80}
                  timeout={9000}
                />
              </div>
            ) : (
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell}>
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
                        <strong>No Data Found</strong>
                      </h3>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
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

export default Status;
