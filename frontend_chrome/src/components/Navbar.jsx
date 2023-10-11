import { Navbar as ReactNavBar, NavItem, Nav } from "reactstrap";
import {
  getWorksnapToken,
  setWorksnapToken,
  resetApp,
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
          {worksnapToken && (
            <>
              <NavItem>
                <NavLink to="/account-info">Account</NavLink>
              </NavItem>
              <NavItem
                onClick={() => {
                  chrome.identity.removeCachedAuthToken({
                    token: googleAccessToken,
                  });
                }}
              >
                <NavLink
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
