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
import { useEffect, useState } from "react";
import axios from "axios";

function NavBar() {
  const [googleAccessToken, setGoogleAccessToken] = useState();
  const [worksnapToken, setWorksnapToken] = useState();
  useEffect(() => {
    async function callBackend() {
      if (googleAccessToken) {
        const response = await axios.post("http://localhost:3000/users/login", {
          google_access_token: googleAccessToken,
        });
        setWorksnapToken(response.data.worksnap_token);
        return response;
      }
    }
    callBackend();
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
                    setGoogleAccessToken(token);
                  }
                );
              }}
            >
              <NavLink>Login</NavLink>
            </NavItem>
          ) : (
            <NavItem
              onClick={() => {
                chrome.identity.removeCachedAuthToken(
                  { token: googleAccessToken },
                  function (response) {
                    setWorksnapToken(null);
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
