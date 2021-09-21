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
import axios from "axios";
import Loader from "react-loader-spinner";
import { useGlobalContext } from "../../../context.js";
import { GlobalFilter } from "../RestaurantDetails/GlobalFilter";
import "../table.css";
import Swal from "sweetalert2";

const ManageSubscription = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    isSidebarOpen,
    manageubscription,
    restaurantSubcriptionModify,
    size,
    changeStatusSubcription
  } = useGlobalContext();

  const getToken = localStorage.getItem("user");
  var myToken = JSON.parse(getToken);

  const stateChange = async (subcription_id, restaurant_id, status) => {
    try {
      var querys =
        "?restaurant_id=" +
        restaurant_id +
        "&subcription_id=" +
        subcription_id +
        "&status=" +
        status;
  
      const apiCall = await axios.get(restaurantSubcriptionModify + querys, {
        headers: { Authorization: myToken.token },
      });
  
      if (apiCall.status === 200) {
        callApis();
      } else {
        Swal.fire({
          title: "Ohh no!",
          text: 'something going wrong',
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
  }

  const changestate = async (subcription_id, restaurant_id, status) => {
    try {
      var querys =
        "?restaurant_id=" +
        restaurant_id +
        "&subcription_id=" +
        subcription_id +
        "&status=" +
        status;
  
      const apiCall = await axios.get(changeStatusSubcription + querys, {
        headers: { Authorization: myToken.token },
      });
  
      if (apiCall.status === 200) {
        callApis();
      } else {
        Swal.fire({
          title: "Ohh no!",
          text: 'something going wrong',
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
  };

  const callApis = async () => {
    try {
      const result = await axios(manageubscription, {
        headers: { Authorization: myToken.token },
      })
      if (result.status === 200) {
        setTableData(result.data.data);
        setLoading(false);
      } else {
        Swal.fire({
          title: "Ohh no!",
          text: 'something going wrong',
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
  }

  useEffect(() => {
    callApis();
  }, [manageubscription]);

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
      accessorshow: true,
    },
    {
      Header: "Phone Number",
      accessor: "mobile",
    },
    {
      Header: "restaurant_id",
      accessor: "restaurant_id",
    },
    {
      accessor: "subcription_running",
    },
    {
      accessor: "_id",
    },
    {
      Header: "Details",
      accessor: "subcription_accepted_admin",
      Cell: ({ cell }) => {
        if(!cell.row.values.subcription_running){
          return (
            <>
            <button
              className="Cancel_Details my-2"
              onClick={() =>
                stateChange(
                  cell.row.values._id,
                  cell.row.values.restaurant_id,
                  "canceled"
                )
              }
            >
            <small>Cancel</small>
            </button>
            <button
              className="Resume_Details"
              onClick={() =>
                stateChange(
                  cell.row.values._id,
                  cell.row.values.restaurant_id,
                  "accepted"
                )
              }
            >
              <small>Activate</small>
            </button> 
            </>
          )
        } else {
          if(cell.row.values.subcription_accepted_admin === 'accepted'){
            return(
              <>
            <button
                className="Cancel_Details" style={{backgroundColor:"#ef4242"}}
                onClick={() =>
                  changestate(
                    cell.row.values._id,
                    cell.row.values.restaurant_id,
                    "stopped"
                  )
                }
              >
              <small>Pause</small>
              </button>
              </>
            )
          } else if(cell.row.values.subcription_accepted_admin === 'stopped'){
            return(
              <>
            <button
                className="Resume_Details"
                onClick={() =>
                  changestate(
                    cell.row.values._id,
                    cell.row.values.restaurant_id,
                    "accepted"
                  )
                }
              >
              <small>Resume</small>
              </button>
              </>
            )
          }

          
        }

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
      initialState: {
        hiddenColumns: ["restaurant_id", "subcription_running", "_id"],
      },
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
                      <small > {column.render("Header")}</small>
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

export default ManageSubscription;
