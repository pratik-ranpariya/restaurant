import react from "react";
import {BiSearchAlt} from "react-icons/bi"

export const GlobalFilter = ({ filter, setfilter }) => {
  return (
    <div
      className="d-flex align-items-center mb-3 ml-2"
      // style={{ width: "75vw" }}
    >
      {/* Sreach :&nbsp; */}
      <BiSearchAlt size={25} style={{marginRight: "-28px" ,color:"#d10640", zIndex:"1"}}/>
      <input
        type="Search"
        placeholder="Search"
        aria-label="Search"
        style={{
          border: "none",
          border: "2px solid #ea7a9a",
          background: "",
          outline: "none",
          padding: "8px 10px 8px 30px",
          width: "300px",
          borderRadius: "10px",
          fontSize:"0.8rem"
        }}
        value={filter || ""}
        onChange={(e) => setfilter(e.target.value)}
      />{" "}
    </div>
  );
};
