export const COLUMNS = [
  {
    Header: "Resturent Name",
    accessor: "Resturent_Name",
  },
  {
    Header: "Location",
    accessor: "Location",
  },
  {
    Header: "City",
    accessor: "City",
  },
  {
    Header: "Email ID",
    accessor: "Email_ID",
  },
  {
    Header: "Phone Number",
    accessor: "Phone_Number",
  },
  //   {
  //     Header: "Status",
  //     accessor: "Status",
  //     Cell: ({ cell }) => {
  //       return cell.row.values.Status === "Pending" ? (
  //         <button
  //           style={{
  //             background: "linear-gradient(to right, #ea7b9a, #fac7b6)",
  //             padding: "6px 10px",
  //             textAlign: "center",
  //             color: "white",
  //             textTransform: "capitalize",
  //             border: "transparent",
  //             borderRadius: "10px",
  //           }}
  //         >
  //           {cell.row.values.Status}
  //         </button>
  //       ) : cell.row.values.Status === "delivered" ? (
  //         <button
  //           style={{
  //             background: "green",
  //             padding: "6px 10px",
  //             textAlign: "center",
  //             color: "white",
  //             textTransform: "capitalize",
  //             border: "transparent",
  //             borderRadius: "10px",
  //           }}
  //         >
  //           {cell.row.values.Status}
  //         </button>
  //       ) : cell.row.values.Status === "cancelled" ? (
  //         <button
  //           style={{
  //             background: "black",
  //             padding: "6px 10px",
  //             textAlign: "center",
  //             color: "white",
  //             textTransform: "capitalize",
  //             border: "transparent",
  //             borderRadius: "10px",
  //           }}
  //         >
  //           {cell.row.values.Status}
  //         </button>
  //       ) : (
  //         ""
  //       );
  //     },
  //   },
];
