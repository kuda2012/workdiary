import "bootstrap/dist/css/bootstrap.min.css";

import { Navbar as ReactNavBar, NavItem, Nav, Button } from "reactstrap";
import {
  setGoogleAccessToken,
  getWorksnapToken,
  setWorksnapToken,
} from "../helpers/actionCreators";
import { NavLink } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const NavBar = () => {
  const dispatch = useDispatch();
  const googleAccessToken = useSelector((state) => state.google_access_token);
  const worksnapToken = useSelector((state) => state.worksnap_token);

  useEffect(() => {
    if (googleAccessToken) {
      dispatch(getWorksnapToken(googleAccessToken));
    }
  }, [googleAccessToken]);
  return (
    <>
      <ReactNavBar color="light" light expand="md">
        <NavLink to="/">Worksnap</NavLink>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink to="/account-info">Account</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/delete-worksnap-account">Delete user</NavLink>
          </NavItem>
          {!worksnapToken ? (
            <NavItem
              onClick={() => {
                chrome.identity.getAuthToken(
                  { interactive: true },
                  function (token) {
                    dispatch(setGoogleAccessToken(token));
                  }
                );
              }}
            >
              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Sign in with Google <img src="/Google.png"></img>
              </NavLink>
            </NavItem>
          ) : (
            <NavItem
              onClick={() => {
                chrome.identity.removeCachedAuthToken(
                  { token: googleAccessToken },
                  function () {
                    dispatch(setWorksnapToken(null));
                  }
                );
              }}
            >
              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Logout<img src="/Google.png"></img>
              </NavLink>
            </NavItem>
          )}
        </Nav>
      </ReactNavBar>
    </>
  );
};

export default NavBar;
