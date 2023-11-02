import { Navbar as ReactNavBar, NavItem, Nav, NavbarBrand } from "reactstrap";
import { getWorksnapToken, resetApp } from "../helpers/actionCreators";
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
        <NavbarBrand>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            Worksnap
          </NavLink>
        </NavbarBrand>
        <Nav className="ms-auto" navbar>
          {worksnapToken && (
            <>
              <NavItem>
                <NavLink to="/account-info" style={{ textDecoration: "none" }}>
                  Settings
                </NavLink>
              </NavItem>
              <NavItem
                onClick={() => {
                  chrome.identity.removeCachedAuthToken({
                    token: googleAccessToken,
                  });
                }}
              >
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
