import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useRowSelect, useGlobalFilter, useSortBy } from "react-table";
import { Link } from "react-router-dom";
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from "react-icons/ti";
import { useGlobalContext } from "../../../context.js";
import axios from "axios";
import Loader from "react-loader-spinner";
import "../table.css";
import { GlobalFilter } from "./GlobalFilter.js";
import Swal from "sweetalert2";

const RestaurantDetails = () => {
  const { isSidebarOpen, restaurants_details_table, size } = useGlobalContext();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const getToken = localStorage.getItem("user");
        var myToken = JSON.parse(getToken);
        const result = await axios(restaurants_details_table, {
          headers: { Authorization: myToken.token },
        });
        if (result.status === 200) {
          setTableData(result.data.data);
          setLoading(false);
        } else {
          Swal.fire({
            title: "Ohh no!",
            text: result.data.msg,
            icon: "error",
            confirmButtonColor: 'rgb(234, 122, 154)'
          })
        }
      } catch (e) {
        Swal.fire({
          title: "Ohh no!",
          text: e.message,
          icon: "error",
          confirmButtonColor: 'rgb(234, 122, 154)'
        })
      }
    })();
  }, [restaurants_details_table]);

  const COLUMNS = [
    {
      Header: "Restaurant Name",
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
      accessor: "_id",
      Cell: ({ cell }) => {
        return (
          <>
            <Link to={`/RestaurantDetails/Restaurant?name=${cell.row.values._id}`}>
              <button className="More_Details my-2">
                <small>More&nbsp;Details</small>
              </button>
            </Link>
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
    setGlobalFilter,
  } = useTable(
    {
      columns: columns,
      data: data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  );
  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <>
      <div
        className={`${isSidebarOpen ? "shrink2 p-4" : "my_container2 p-4"} `}
      >
        <GlobalFilter filter={globalFilter} setfilter={setGlobalFilter}/>
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
                />
              </div>
            ) : (
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
          className="d-flex justify-content-between overflow-auto pl-4 mt-2"
          style={{
            maxWidth: "75vw",
          }}
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
                  className={pageIndex === i ? "active page-item" : "page-item"}
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
    </>
  );
};

export default RestaurantDetails;
