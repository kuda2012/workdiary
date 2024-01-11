import { useEffect } from "react";
import { Navbar as ReactNavBar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginOrSignupGoogle } from "../helpers/actionCreators";
import "../styles/Navbar.css";

const NavBar = ({ openAuthModal, openAllPostsModal }) => {
  const dispatch = useDispatch();
  const googleAccessToken = useSelector((state) => state.google_access_token);
  const workdiaryToken = useSelector((state) => state.workdiary_token);

  useEffect(() => {
    if (googleAccessToken) {
      dispatch(loginOrSignupGoogle(googleAccessToken));
    }
  }, [googleAccessToken]);

  return (
    <>
      <ReactNavBar color="light" className="navbar-expand-lg">
        <NavbarBrand className="nav-brand">
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
                  Search Diary🔎
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
