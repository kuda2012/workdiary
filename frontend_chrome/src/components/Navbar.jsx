import React, { useState, useEffect } from "react";
import { Navbar as ReactNavBar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle, resetApp } from "../helpers/actionCreators";
import SearchBar from "./SearchBar";
import "../styles/Navbar.css";

const NavBar = ({ openAuthModal }) => {
  const dispatch = useDispatch();
  const googleAccessToken = useSelector((state) => state.google_access_token);
  const worksnapToken = useSelector((state) => state.worksnap_token);

  useEffect(() => {
    if (googleAccessToken) {
      dispatch(loginGoogle(googleAccessToken));
    }
  }, [googleAccessToken]);

  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };
  return (
    <>
      <ReactNavBar color="light" className="navbar-expand-lg">
        {worksnapToken && (
          <NavItem className="nav-item" onClick={toggleSearchBar}>
            <NavLink className="nav-link">Search</NavLink>
          </NavItem>
        )}
        {worksnapToken && isSearchBarVisible && (
          <SearchBar toggleSearchBar={toggleSearchBar} />
        )}
        <NavbarBrand
          className={`nav-brand ${
            worksnapToken && isSearchBarVisible && "nav-brand-move-right"
          }`}
        >
          <NavLink to="#" className="nav-link">
            Work Diary
          </NavLink>
        </NavbarBrand>
        <Nav navbar>
          {!worksnapToken && (
            <>
              <NavItem>
                <NavLink
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    openAuthModal();
                  }}
                >
                  Login
                </NavLink>
              </NavItem>
            </>
          )}
          {worksnapToken && (
            <>
              <NavItem>
                <NavLink
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(resetApp());
                  }}
                >
                  Logout
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </ReactNavBar>
    </>
  );
};

export default NavBar;
