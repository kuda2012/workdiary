import "bootstrap/dist/css/bootstrap.min.css";

import {
  Navbar as ReactNavBar,
  NavItem,
  NavbarToggler,
  Collapse,
  NavLink,
  Nav,
  NavbarBrand,
} from "reactstrap";
import {
  setGoogleAccessToken,
  getWorksnapToken,
  setWorksnapToken,
} from "../helpers/actionCreators";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function NavBar() {
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
        <NavbarBrand>Worksnap</NavbarBrand>
        <Nav className="ml-auto" navbar>
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
              <NavLink>
                Sign in with Google <img src="/Google.png"></img>
              </NavLink>
            </NavItem>
          ) : (
            <NavItem
              onClick={() => {
                chrome.identity.removeCachedAuthToken(
                  { token: googleAccessToken },
                  function (response) {
                    dispatch(setWorksnapToken(null));
                  }
                );
              }}
            >
              <NavLink>Logout</NavLink>
            </NavItem>
          )}
        </Nav>
      </ReactNavBar>
    </>
  );
}

export default NavBar;
