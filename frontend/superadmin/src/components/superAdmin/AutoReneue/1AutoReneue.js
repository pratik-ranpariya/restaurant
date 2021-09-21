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
import axios from "axios";
import { useGlobalContext } from "../../../context.js";
import { GlobalFilter } from "../RestaurantDetails/GlobalFilter";
import "../table.css";

const AutoReneue = () => {
  const { isSidebarOpen, generate_receipt, generate_receipt_table, size } =
    useGlobalContext();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = localStorage.getItem("user");
  var myToken = JSON.parse(getToken);

  const stateChange = async (restaurant_id) => {
    var querys = "?restaurant_id=" + restaurant_id;

    console.log(querys);
    const apiCall = await axios.get(generate_receipt + querys, {
      headers: { Authorization: myToken.token },
    });
    console.log(apiCall.data);

    if (apiCall.data.status === 200) {
      // callApis();
      alert(apiCall.data.msg);
    } else {
    }
  };

  const callApis = async () => {
    const result = await axios(generate_receipt_table, {
      headers: { Authorization: myToken.token },
    });
    if (result.status === 200) {
      setTableData(result.data.data);
      setLoading(false);
    } else {
    }
  };

  useEffect(() => {
    callApis();
  }, [generate_receipt_table]);

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
      accessor: "restaurant_id",
      Cell: ({ cell }) => {
        return (
          <div style={{ borderBottom: "none" }}>
            <button
              className="More_Details"
              onClick={() => stateChange(cell.row.values.restaurant_id)}
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
