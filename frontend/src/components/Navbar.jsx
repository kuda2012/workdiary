import {
  Navbar as ReactNavBar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import "../styles/Navbar.css";

const NavBar = ({ openHowToModal }) => {
  return (
    <ReactNavBar color="light" className="navbar-expand-lg">
      <NavbarBrand className="nav-brand" to="/">
        Workdiary
      </NavbarBrand>
      <Nav className="me-auto">
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
      </Nav>
    </ReactNavBar>
  );
};

export default NavBar;
