import React, { useState, useEffect } from "react";
import { Navbar as ReactNavBar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle, resetApp } from "../helpers/actionCreators";
import SearchBar from "./SearchBar";
import "../styles/Navbar.css";

const NavBar = ({ openAuthModal, openAllPostsModal }) => {
  const dispatch = useDispatch();
  const googleAccessToken = useSelector((state) => state.google_access_token);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
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
        {/* {workdiaryToken && (
          <NavItem className="nav-item" onClick={toggleSearchBar}>
            <NavLink className="nav-link">Search</NavLink>
          </NavItem>
        )}
        {workdiaryToken && isSearchBarVisible && (
          <SearchBar toggleSearchBar={toggleSearchBar} />
        )} */}
        <NavbarBrand
          className={`nav-brand ${
            workdiaryToken && isSearchBarVisible && "nav-brand-move-right"
          }`}
        >
          <NavLink to="#" className="nav-link">
            Work Diary
          </NavLink>
        </NavbarBrand>
        <Nav navbar>
          {!workdiaryToken && (
            <>
              <NavItem className="nav-item">
                <NavLink
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    openAuthModal();
                  }}
                >
                  Login/Sign-up
                </NavLink>
              </NavItem>
            </>
          )}
          {/* {workdiaryToken && (
            <>
              <NavItem className="nav-item">
                <NavLink
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(resetApp());
                    // chrome.identity.clearAllCachedAuthTokens();
                  }}
                >
                  Logout
                </NavLink>
              </NavItem>
            </>
          )} */}
          {workdiaryToken && (
            <>
              <NavItem className="nav-item">
                <NavLink
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    openAllPostsModal();
                  }}
                >
                  All posts 🔎
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
