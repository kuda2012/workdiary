import React, { useState, useEffect } from "react";
import { Navbar as ReactNavBar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle, resetApp } from "../helpers/actionCreators";
import SearchBar from "./SearchBar";

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
          <NavItem style={{ listStyleType: "none" }} onClick={toggleSearchBar}>
            <NavLink style={{ textDecoration: "none" }}>Search</NavLink>
          </NavItem>
        )}
        {worksnapToken && isSearchBarVisible && (
          <SearchBar toggleSearchBar={toggleSearchBar} />
        )}
        <NavbarBrand
          style={{
            fontSize: "1.5rem",
            position: "relative",
            right: `${worksnapToken && isSearchBarVisible ? "161px" : "0px"}`,
            textTransform: "none",
          }}
        >
          <NavLink to="#" style={{ textDecoration: "none" }}>
            Work Diary
          </NavLink>
        </NavbarBrand>
        <Nav navbar>
          {!worksnapToken && (
            <>
              <NavItem>
                <NavLink
                  style={{ textDecoration: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    openAuthModal();
                    // try {
                    //   dispatch(loggingIn());
                    //   chrome.identity.getAuthToken(
                    //     { interactive: true },
                    //     function (token) {
                    //       dispatch(setGoogleAccessToken(token));
                    //     }
                    //   );
                    // } catch (error) {
                    //   dispatch(resetApp());
                    // }
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
                  style={{ textDecoration: "none" }}
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
