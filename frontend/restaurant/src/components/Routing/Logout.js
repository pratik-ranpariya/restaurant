import React from "react";
import { useHistory } from "react-router";
import Swal from "sweetalert2";

const Logout = () => {
  const history = useHistory();
  if (localStorage.getItem("user")) {
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "Are You Sure You Want to Log Out?",
    //   type: "warning",
    //   showCancelButton: true,
    //   cancelButtonColor: "#DD6B55",
    //   confirmButtonColor: "#DD6B55",
    //   confirmButtonText: "Yes",
    //   cancelButtonText: "No",
    //   closeOnConfirm: false,
    //   closeOnCancel: false
    // }, function (isConfirm) {
    //   if (isConfirm) {
    //     localStorage.clear();
    //     history.push("/");
    //     window.location.reload(true);
    //     // Swal("Deleted!", "Your imaginary file has been deleted.", "success");
    //   } else {
    //     history.push("/Dashboard");
    //     // Swal("Cancelled", "Your imaginary file is safe :)", "error");
    //   }
    // });

    Swal.fire({
      title: 'Are you sure?',
      text: "Are You Sure You Want to Log Out?",
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonColor: 'rgb(234, 122, 154)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'logout successfully',
          'success'
        )
        localStorage.clear();
        history.push("/");
        window.location.reload(true);
      } else {
        history.push("/Dashboard");
      }
    })

    // var a = window.confirm("Are You Sure You Want to Log Out?");
    // if (a) {
    //   localStorage.clear();
    //   history.push("/");
    //   window.location.reload(true);
    // } else {
    //   history.push("/Dashboard");
    // }
  }

  return <div></div>;
};

export default Logout;
