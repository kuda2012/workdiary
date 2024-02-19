import {
  Navbar as ReactNavBar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { NavLink as RRNavLink } from "react-router-dom";
import "../styles/Navbar.css";

const NavBar = ({ openHowToModal }) => {
  const isMobile = window.innerWidth <= 768;
  return (
    <ReactNavBar color="light" className="navbar-expand-lg">
      <NavbarBrand className="nav-brand" tag={RRNavLink} to="/">
        Workdiary
      </NavbarBrand>
      <Nav className="me-auto">
        {!isMobile && (
          <NavItem className="nav-item">
            <NavLink
              className="nav-link"
              to="#"
              onClick={(e) => {
                e.preventDefault();
                openHowToModal();
              }}
            >
              About
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </ReactNavBar>
  );
};

export default NavBar;
