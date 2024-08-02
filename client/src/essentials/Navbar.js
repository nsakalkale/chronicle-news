import logo from "../images/logo.png";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="bg-dark-blue p-2 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="logo">
            <img src={logo} width={50} alt="Logo" />
          </div>
          <div className="items-nav">
            <NavLink to="/" className="me-3 fw-bold nitem">
              Top Headlines
            </NavLink>
            <NavLink to="/foryou" className="me-3 fw-bold nitem">
              For You
            </NavLink>
            <NavLink to="/sports" className="me-3 fw-bold nitem">
              Sports
            </NavLink>
            <NavLink to="/finance" className="me-3 fw-bold nitem">
              Finance
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
